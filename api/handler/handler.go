package api

import (
	"api/db"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

type Logininfo struct {
	Name     string `json:"name" db:"name"`
	Password string `json:"password" db:"password"`
	Email    string `json:"email" db:"email"`
}

type Userinfo struct {
	Username string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
}

type Registerinfo struct {
	ID       int    `json:"id" db:"id"`
	Username string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type UserGetinfo struct {
	ID       int    `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type PredictData struct {
	Data []struct {
		Predictions []struct {
			Date     string  `json:"date"`
			Forecast float64 `json:"forecast"`
			Real     string  `json:"real"`
		} `json:"predictions"`
		ProductName string `json:"product_name"`
	} `json:"data"`
	Success string `json:"success"`
}

type PredictProductData struct {
	Predictions []struct {
		Date     string  `json:"date"`
		Forecast float64 `json:"forecast"`
		Real     string  `json:"real"`
	} `json:"predictions"`
	ProductName string `json:"product_name"`
}

var pgsql = db.Client

func Get(c *fiber.Ctx) error {
	return c.JSON("Hello-World")
}

// m
func Login(c *fiber.Ctx) error {

	data := Logininfo{}

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Can't parsing the data",
		})
	}

	log.Println(data.Name, data.Password)
	var user = [1]Userinfo{{Username: data.Name, Email: data.Email}}

	token, err := login(data)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Login failed",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success":      true,
		"message":      "Login Successful",
		"user":         user,
		"access_token": token,
	})
}

// hmsswww
func login(data Logininfo) (string, error) {

	response := Logininfo{}

	query := `SELECT name,password FROM "user" WHERE 1=1 AND`
	if data.Name != "" {
		query += ` name ='` + data.Name + `'`
	} else {
		query += ` email ='` + data.Email + `'`
	}

	log.Println(query)

	err := pgsql.Get(&response, query)
	if err != nil {
		log.Println(err)
		return "", err
	}

	// Create the Claims
	claims := jwt.MapClaims{
		"name":  data.Name,
		"admin": true,
		"exp":   time.Now().Add(time.Hour * 720).Unix(),
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		log.Printf("token.SignedString: %v", err)
		return "", err
	}
	return t, nil
}

var client = &http.Client{}

func Predict(c *fiber.Ctx) error {

	request, err := http.NewRequest("GET", "http://pythonapi:3000/predict", nil)
	if err != nil {
		log.Println(err)
		return err
	}

	response, err := client.Do(request)
	if err != nil {
		log.Println(err)
		return err
	}
	data := PredictData{}
	err = json.NewDecoder(response.Body).Decode(&data)
	if err != nil {
		log.Println(err)
		return err
	}

	defer response.Body.Close()
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": data.Success,
		"data":    data.Data,
	})
}

func PredictProduct(c *fiber.Ctx) error {
	product := c.Params("product_name")

	request, err := http.NewRequest("GET", "http://pythonapi:3000/predict/"+product, nil)
	if err != nil {
		log.Println(err)
		return err
	}

	response, err := client.Do(request)
	if err != nil {
		log.Println(err)
		return err
	}
	data := PredictProductData{}
	err = json.NewDecoder(response.Body).Decode(&data)
	if err != nil {
		log.Println(err)
		return err
	}

	defer response.Body.Close()
	return c.Status(fiber.StatusOK).JSON(data)
}

func UploadFIle(c *fiber.Ctx) error {
	// Get the uploaded file from the request
	file, err := c.FormFile("file")
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Retreive file failed",
		})
	}

	// Create the destination file path
	destFilePath := "/app/file/Groceries_dataset.csv"

	// Check if the file already exists
	if _, err := os.Stat(destFilePath); err == nil {
		// File exists, remove it
		if err := os.Remove(destFilePath); err != nil {
			log.Println(err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Remove Failed",
			})
		}
	}

	// Save the uploaded file to the destination path
	if err := c.SaveFile(file, destFilePath); err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Save Failed",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "File Uploaded",
	})
}

func Download(c *fiber.Ctx) error {
	// Read the file from the disk
	filePath := "/app/file/Groceries_dataset.csv"
	fileData, err := ioutil.ReadFile(filePath)
	if err != nil {
		return err
	}

	// Set the response headers
	c.Set(fiber.HeaderContentType, "application/octet-stream")
	c.Set(fiber.HeaderContentDisposition, "attachment; filename=Groceries_dataset.csv")

	// Send the file data in the response
	return c.Send(fileData)
}

func Checkfile(c *fiber.Ctx) error {
	// Specify the file path
	filePath := "/app/file/Groceries_dataset.csv"

	// Check if the file exists
	if _, err := os.Stat(filePath); err != nil {
		// File not exists
		return c.JSON(fiber.Map{
			"success": false,
			"message": "File does not exist",
		})
	}
	return c.JSON(fiber.Map{
		"success": true,
		"message": "File exist",
	})
}

func Register(c *fiber.Ctx) error {
	body := Logininfo{}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Can't parsing the data",
		})
	}

	var lastID int
	query := `INSERT INTO "user" (name,email,password) VALUES ($1,$2,$3) RETURNING id`
	stmt, err := pgsql.Prepare(query)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "insert Failed",
		})
	}
	defer stmt.Close()

	err = stmt.QueryRow(body.Name, body.Email, body.Password).Scan(&lastID)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "insert Failed",
		})
	}

	var userdetail = [1]Registerinfo{{ID: lastID, Username: body.Name, Email: body.Email, Password: body.Password}}

	return c.JSON(fiber.Map{
		"msg":  "Registration successfull",
		"data": userdetail,
	})
}

func GetUser(c *fiber.Ctx) error {
	body := []UserGetinfo{}
	query := `SELECT * FROM "user"`
	err := pgsql.Select(&body, query)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Get Failed",
		})
	}
	return c.JSON(body)
}
