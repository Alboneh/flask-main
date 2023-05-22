import datetime
import time
from variables import *
import pandas as pd
import numpy as np
import tensorflow as tf

class Preprocessing:
    def __init__(self, model_path, data_name="file/Groceries_dataset.csv", columns_not_to_be_removed=columns_not_to_be_removed, window_size=30, batch_size=32):
        self.columns_not_to_be_removed = columns_not_to_be_removed
        self.data_name = data_name
        self.model = tf.keras.models.load_model(model_path)
        self.model_path = model_path
        self.data_asarray = None
        self.columns = None
        self.dates = None
        self.window_size = window_size
        self.batch_size = batch_size

    def sparse_data(self):
        raw_data = pd.read_csv(self.data_name)
        raw_data["Date"] = pd.to_datetime(raw_data["Date"], format="%d-%m-%Y")
        raw_data["count"] = 1
        grouped_data = raw_data.groupby(["Date", "itemDescription"]).sum()
        grouped_data.reset_index(inplace=True)

        sparse_data = pd.pivot_table(grouped_data, values="count", columns="itemDescription", index="Date", aggfunc=np.sum)
        sparse_data = sparse_data.applymap(lambda x: 0 if np.isnan(x) else x)

        for column in sparse_data.columns:
            if column not in columns_not_to_be_removed:
                sparse_data.drop(column, axis=1, inplace=True)

        self.data_asarray = sparse_data.values
        self.columns = [i for i in sparse_data.columns]
        self.columns[7] = "fruit-vegetable juice"
        
        # Get the latest date from the CSV file
        latest_date = raw_data["Date"].max()
        
        # Generate the prediction dates starting from the day after the latest date
        self.dates = [str((latest_date + pd.Timedelta(days=i+1)).date()).replace("-", "/") for i in range(14)]

    def predict(self):
        self.sparse_data()

        forecast = self.model_forecast(self.model, self.data_asarray[714 - self.window_size:-1], self.window_size, self.batch_size)
        results = forecast.squeeze()

        # Reshape the results array to have a 2-dimensional shape
        results = np.reshape(results, (-1, len(self.columns)))

        prediction_df = pd.DataFrame(np.abs(np.round(results + 0.25)), columns=list(self.columns))

        pred_list = []
        for column in prediction_df.columns:
            product_dict = dict()
            product_dict["product_name"] = column
            product_dict["predictions"] = []
            for date, value in zip(self.dates, prediction_df[column]):
                date_and_value = dict()
                date_and_value["date"] = date
                date_and_value["forecast"] = value
                date_and_value["real"] = "-"
                product_dict["predictions"].append(date_and_value)
            pred_list.append(product_dict)

        return pred_list

    def model_forecast(self, model, series, window_size, batch_size):
        dataset = tf.data.Dataset.from_tensor_slices(series)
        dataset = dataset.window(window_size, shift=1, drop_remainder=True)
        dataset = dataset.flat_map(lambda w: w.batch(window_size))
        dataset = dataset.batch(batch_size).prefetch(1)
        forecast = model.predict(dataset)

        return forecast
    
   
    def preprocess_new_data(self, new_data):
        df = pd.DataFrame(new_data)
        df["Date"] = pd.to_datetime(df["Date"], format="%d-%m-%Y")
        df["count"] = 1
        grouped_data = df.groupby(["Date", "itemDescription"]).sum()
        grouped_data.reset_index(inplace=True)

        sparse_data = pd.pivot_table(grouped_data, values="count", columns="itemDescription", index="Date", aggfunc=np.sum)
        sparse_data = sparse_data.applymap(lambda x: 0 if np.isnan(x) else x)

        for column in sparse_data.columns:
            if column not in self.columns_not_to_be_removed:
                sparse_data.drop(column, axis=1, inplace=True)

        new_data_asarray = sparse_data.values

        # Concatenate the new data with the existing data
        if self.data_asarray is None:
            self.data_asarray = new_data_asarray
        else:
            self.data_asarray = np.concatenate((self.data_asarray, new_data_asarray), axis=0)

        return self.data_asarray


    def train_model(self):
        try:
            dataset = tf.data.Dataset.from_tensor_slices(self.data_asarray)
            dataset = dataset.window(self.window_size + 1, shift=1, drop_remainder=True)
            dataset = dataset.flat_map(lambda w: w.batch(self.window_size + 1))
            dataset = dataset.shuffle(buffer_size=1000).batch(self.batch_size).prefetch(1)

            # Split the dataset into input and target
            dataset = dataset.map(lambda x: (x[:, :-1], x[:, -1:]))

            # Define and compile the model architecture
            model = tf.keras.models.Sequential([
                tf.keras.layers.Lambda(lambda x: x[:, :-1], input_shape=[self.window_size, self.data_asarray.shape[1]]),
                tf.keras.layers.Dense(32, activation="relu"),
                tf.keras.layers.Dense(self.data_asarray.shape[1])
            ])

            model.compile(loss=tf.keras.losses.MeanSquaredError(), optimizer=tf.keras.optimizers.Adam())

            # Train the model
            model.fit(dataset, epochs=10)

            # Save the trained model
            model.save(self.model_path)

            return True
        except Exception as e:
            print("An error occurred during model training:", e)
            return False