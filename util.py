from variables import *
import pandas as pd
import numpy as np
import tensorflow as tf
from keras.preprocessing.sequence import TimeseriesGenerator

class Preprocessing:
    def __init__(self, model_path, data_name = "Groceries_dataset.csv", columns_not_to_be_removed = columns_not_to_be_removed):
        self.columns_not_to_be_removed = columns_not_to_be_removed
        self.data_name = data_name
        self.model = tf.keras.models.load_model(model_path)
        self.data_asarray = None
        self.columns = None
        self.dates = None

    def sparse_data(self):
        raw_data = pd.read_csv(self.data_name)
        raw_data["Date"] = pd.to_datetime(raw_data["Date"], format="%d-%m-%Y")
        raw_data["count"] = 1
        grouped_data = raw_data.groupby(["Date", "itemDescription"]).sum()
        grouped_data.reset_index(inplace = True)

        sparse_data = pd.pivot_table(grouped_data, values = "count", columns = "itemDescription", index = "Date", aggfunc = np.sum)
        sparse_data = sparse_data.applymap(lambda x: 0 if np.isnan(x) else x)

        for column in sparse_data.columns:
            if column not in columns_not_to_be_removed:
                sparse_data.drop(column, axis = 1, inplace = True)

        self.data_asarray = sparse_data.values
        self.columns = sparse_data.columns
        self.dates = [str(i) for i in sparse_data.index[-14:]]

    def predict(self):
        self.sparse_data()
        generator = TimeseriesGenerator(self.data_asarray, self.data_asarray, length = 14, batch_size = self.data_asarray.shape[0]*10)
        X = generator[0][0]
        X_new = self.data_asarray[-14:, :].copy()

        X_last = np.copy(X[-1, :, :])
        for _ in range(14):
            prediction = self.model.predict(X_last[np.newaxis, :, :])
            X_last  = np.concatenate([X_last, prediction])
            X_last = X_last[1:]

        prediction_data = np.concatenate([X_new, X_last])
        prediction_df = pd.DataFrame(prediction_data, columns=list(self.columns)).iloc[-14:, :]

        pred_list = list()
        for column in prediction_df.columns:
            product_dict = dict()
            product_dict["product_name"] = column
            product_dict["predictions"] = list()
            for date, value in zip(self.dates, prediction_df[column]):
                date_and_value = dict()
                date = date.replace("-", "/").split(" ")[0]
                date_and_value["date"] = date
                date_and_value["forecast"] = value
                date_and_value["real"] = "-"
                product_dict["predictions"].append(date_and_value)
            pred_list.append(product_dict)
        
        return pred_list
