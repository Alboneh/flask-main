package api

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/url"

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

	date := c.FormValue("input_date")
	soldStr := c.FormValue("sold")

	product := c.Params("product_name")

	urls := "https://leftoverpy.serveo.net/predict/" + product

	formData := url.Values{}
	formData.Set("input_date", date)
	formData.Set("sold", soldStr)

	// Encode the form data
	payload := bytes.NewBufferString(formData.Encode())

	// Create the HTTP request
	req, err := http.NewRequest("POST", urls, payload)
	if err != nil {
		log.Println(err)
		return err
	}
	// Set the content type header
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// Send the HTTP request
	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return err
	}
	data := PredictProductData{}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		log.Println(err)
		return err
	}

	defer resp.Body.Close()
	return c.Status(fiber.StatusOK).JSON(data)
}
