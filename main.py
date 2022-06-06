import uvicorn
from typing import Union
from fastapi import FastAPI, Form, status
from util import Preprocessing
from fastapi.responses import JSONResponse

app = FastAPI()
preprocess = Preprocessing("model.h5")
prediction_results = preprocess.predict()

@app.get("/predict")
def predictAllProducts():
    return prediction_results

@app.get("/predict/{product_name}")
def predictByProductName(product_name, days: Union[int, None] = None):
    try:
        data = next(product for product in prediction_results if product["product_name"] == product_name)
        copied_dict = data.copy()
    except:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content = {"message": f"Product '{product_name}' doesn\'t exist"})

    if (days):
        copied_dict["predictions"] = copied_dict["predictions"][:days]
        return copied_dict
    return data

@app.post("/{product_name}")
def input_product(product_name, input_date: str = Form(), sold: float = Form()):
    try:
        data = next(product for product in prediction_results if product["product_name"] == product_name)
    except:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content = {"message": f"Product '{product_name}' doesn\'t exist"})
    
    prediction = next(item for item in data["predictions"] if item["date"] == input_date)
    prediction["real"] = sold
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
