package api

import (
	"api/db"
	"encoding/csv"
	"encoding/json"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

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
func RetrainModel(c *fiber.Ctx) error {

	request, err := http.NewRequest("GET", "http://pythonapi:3000/update_model", nil)
	if err != nil {
		log.Println(err)
		return err
	}

	response, err := client.Do(request)
	if err != nil {
		log.Println(err)
		return err
	}
	data := RetrainStatus{}

	err = json.NewDecoder(response.Body).Decode(&data)
	if err != nil {
		log.Println(err)
		return err
	}

	defer response.Body.Close()

	if !data.Success {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Retrain Failed",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Retrain Success",
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
	fileData, err := os.ReadFile(filePath)
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

func UserEdit(c *fiber.Ctx) error {
	body := Logininfo{}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Can't parse the data",
		})
	}

	id := c.Params("id")

	query := `UPDATE "user" SET name = $1, email = $2, password = $3 WHERE id = $4`

	stmt, err := pgsql.Prepare(query)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Update Failed",
		})
	}

	defer stmt.Close()

	_, err = stmt.Exec(body.Name, body.Email, body.Password, id)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Update Failed",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Update Success",
	})
}

func UserDelete(c *fiber.Ctx) error {

	Id := c.Params("id")

	query := `DELETE FROM "user" WHERE id =` + Id

	_, err := pgsql.Exec(query)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Delete Failed",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Delete Success",
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

func GetOriginData(c *fiber.Ctx) error {
	filepath := `/app/file/Groceries_dataset.csv`
	file, err := readCSV(filepath)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Get CSV Failed",
		})
	}
	return c.JSON(file)

}
func Create(c *fiber.Ctx) error {
	filepath := `/app/file/Groceries_dataset.csv`
	body := InputData{}
	err := c.BodyParser(&body)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Parse Failed",
		})
	}
	err = addDataToCSV(filepath, body)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Create Failed",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Data Created",
	})
}

func Update(c *fiber.Ctx) error {
	filepath := `/app/file/Groceries_dataset.csv`
	body := InputData{}
	err := c.BodyParser(&body)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Parse Failed",
		})
	}
	err = updateDataInCSV(filepath, body)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Update Failed",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Data Updated",
	})
}

func Delete(c *fiber.Ctx) error {
	filepath := `/app/file/Groceries_dataset.csv`
	body := InputData{}
	err := c.BodyParser(&body)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Parse Failed",
		})
	}
	err = deleteDataByProduct(filepath, body)
	if err != nil {
		log.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Delete Failed",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Data Deleted",
	})
}

func readCSV(filename string) ([]CSVData, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	dataList := []CSVData{}

	// Skip the header row if present
	if _, err := reader.Read(); err != nil {
		return nil, err
	}
	for {
		row, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		productName := row[2] // Assuming product name is in the third column (index 2)
		date := row[1]        // Assuming date is in the second column (index 1)

		// Find if the entry already exists in dataList
		found := false
		for i := range dataList {
			if dataList[i].Product == productName && dataList[i].Date == date {
				// Increment the Count field if the entry already exists
				dataList[i].Count++
				found = true
				break
			}
		}

		// If the entry doesn't exist, create a new one
		if !found {
			data := CSVData{
				Product: productName,
				Date:    date,
				Count:   1,
			}
			dataList = append(dataList, data)
		}
	}
	return dataList, nil
}

func addDataToCSV(filename string, body InputData) error {
	file, err := os.OpenFile(filename, os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	for i := 0; i < body.Count; i++ {
		memberNumber := strconv.Itoa(rand.Intn(9000) + 1000) // Generate random 4-digit member number
		data := []string{memberNumber, body.Date, body.Name}
		err = writer.Write(data)
		if err != nil {
			return err
		}
	}

	return nil
}

func updateDataInCSV(filename string, body InputData) error {
	var existingData [][]string
	var totalCount int
	var newRows [][]string

	file, err := os.OpenFile(filename, os.O_RDWR, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	existingData, err = reader.ReadAll()
	if err != nil {
		return err
	}

	header := existingData[0]
	existingData = existingData[1:] // Exclude the header from existing data

	// Count the existing rows matching the date and product_name
	for _, row := range existingData {
		if row[1] == body.Date && row[2] == body.Name {
			totalCount++
		}
	}

	if totalCount < body.Count {
		diff := body.Count - totalCount
		// Add additional entries
		for i := 0; i < diff; i++ {
			memberNumber := strconv.Itoa(rand.Intn(9000) + 1000) // Generate random 4-digit member number
			newRow := []string{memberNumber, body.Date, body.Name}
			newRows = append(newRows, newRow)
		}
		// Write the new rows
		writer := csv.NewWriter(file)
		defer writer.Flush()
		for _, newRow := range newRows {
			err = writer.Write(newRow)
			if err != nil {
				return err
			}
		}
	}

	if totalCount > body.Count {
		// Delete excess entries
		excessCount := body.Count
		newCount := 0
		for _, row := range existingData {
			if row[1] == body.Date && row[2] == body.Name {
				newCount++
				if newCount > excessCount {
					continue // Skip excess rows
				}
			}
			newRows = append(newRows, row) // Collect non-excess rows
		}

		// Create a temporary file to write the updated data
		tempFilename := filename + ".tmp"
		tempFile, err := os.Create(tempFilename)
		if err != nil {
			return err
		}
		defer tempFile.Close()

		writer := csv.NewWriter(tempFile)
		defer writer.Flush()

		// Write the header to the temporary file
		err = writer.Write(header)
		if err != nil {
			return err
		}

		// Write the new rows to the temporary file
		for _, newRow := range newRows {
			err = writer.Write(newRow)
			if err != nil {
				return err
			}
		}

		// Rename the temporary file to the original filename
		err = os.Rename(tempFilename, filename)
		if err != nil {
			return err
		}
	}

	return nil
}

func deleteDataByProduct(filename string, body InputData) error {
	var existingData [][]string
	var newData [][]string

	file, err := os.OpenFile(filename, os.O_RDWR, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	existingData, err = reader.ReadAll()
	if err != nil {
		return err
	}

	header := existingData[0]
	existingData = existingData[1:] // Exclude the header from existing data

	// Collect the rows that don't match the specified product
	for _, row := range existingData {
		if row[1] != body.Date || row[2] != body.Name {
			newData = append(newData, row)
		}
	}

	// Create a temporary file to write the updated data
	tempFilename := filename + ".tmp"
	tempFile, err := os.Create(tempFilename)
	if err != nil {
		return err
	}
	defer tempFile.Close()

	writer := csv.NewWriter(tempFile)
	defer writer.Flush()

	// Write the header to the temporary file
	err = writer.Write(header)
	if err != nil {
		return err
	}

	// Write the remaining rows to the temporary file
	for _, row := range newData {
		err = writer.Write(row)
		if err != nil {
			return err
		}
	}

	// Rename the temporary file to the original filename
	err = os.Rename(tempFilename, filename)
	if err != nil {
		return err
	}

	return nil
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
