package api

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func PredictAPI(c *fiber.Ctx) error {

	request, err := http.NewRequest("GET", "https://leftoverpy.serveo.net/predict", nil)
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

func PredictProductAPI(c *fiber.Ctx) error {
	product := c.Params("product_name")

	request, err := http.NewRequest("GET", "https://leftoverpy.serveo.net/predict/"+product, nil)
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

func InputPredictProductAPI(c *fiber.Ctx) error {

	body := InputProduct{}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Can't parse the data",
		})
	}

	product := c.Params("product_name")

	// Convert the body data to JSON bytes
	jsonData, err := json.Marshal(body)
	if err != nil {
		log.Println(err)
		return err
	}

	// Create a new request with the specified method, URL, and body
	request, err := http.NewRequest("POST", "https://leftoverpy.serveo.net/predict/"+product, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Println(err)
		return err
	}

	// Set the appropriate headers if needed
	request.Header.Set("Content-Type", "application/json")

	// Send the request and handle the response
	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		log.Println(err)
		return err
	}

	defer response.Body.Close()

	data := PredictProductData{}
	err = json.NewDecoder(response.Body).Decode(&data)
	if err != nil {
		log.Println(err)
		return err
	}

	defer response.Body.Close()
	return c.Status(fiber.StatusOK).JSON(data)
}
