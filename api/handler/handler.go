package api

import (
	"api/db"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

type Logininfo struct {
	Name     string `json:"name" db:"name"`
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

var pgsql = db.Client

func Get(c *fiber.Ctx) error {
	return c.JSON("Hello-World")
}

func Login(c *fiber.Ctx) error {

	data := Logininfo{}

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Can't parsing the data",
		})
	}
	a, b := login2(data)
	if !a {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Login failed",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success":      true,
		"message":      "Login Successful",
		"user":         data.Name,
		"access_token": b,
	})
}

// hmsswww
func login2(data Logininfo) (bool, string) {

	response := []Logininfo{}

	query := fmt.Sprintf(`SELECT name,password FROM "user" WHERE name = '%s' AND password = '%s'`, data.Name, data.Password)

	err := pgsql.Select(&response, query)
	if err != nil {
		log.Println(err)
		return false, ""
	}

	if len(response) < 1 {
		return false, ""
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
		return false, ""
	}
	return true, t
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

func UploadFIle(c *fiber.Ctx) error {
	file, _ := c.FormFile("file")
	if file != nil {
		data, err := file.Open()
		if err != nil {
			log.Println(err)
			return err
		}
		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)
		part, _ := writer.CreateFormFile("file", file.Filename)
		io.Copy(part, data)
		writer.Close()
		request, err := http.NewRequest("POST", "http://pythonapi:3000/upload", body)
		if err != nil {
			log.Println(err)
			return err
		}
		response, err := client.Do(request)
		if err != nil {
			log.Println(err)
			return err
		}
		if response.Status != "200 OK" {
			log.Println(response.Status)
			rsp, _ := ioutil.ReadAll(response.Body)
			log.Println(string(rsp))
			return c.JSON("upload gagal")
		}
		// err := os.Remove("Groceries_dataset.csv")
		// if err != nil {
		// 	log.Println(err)
		// 	return err
		// }
		// dst, err := os.Create("./Groceries_dataset.csv")
		// if err != nil {
		// 	log.Println(err)
		// 	return err
		// }

		// defer dst.Close()
		// // Copy the uploaded file to the filesystem
		// // at the specified destination
		// _, err = io.Copy(dst, a)
		// if err != nil {
		// 	log.Println(err)
		// 	return err
		// }
	}
	return c.JSON("upload success")
}
