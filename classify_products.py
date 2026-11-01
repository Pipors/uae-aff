import json
import os
import pandas as pd


collect = []
headphones = ['name', 'url', 'asin', 'position', 'price', 'numberOfOffers', 'stars', 'reviewsCount', 'thumbnailUrl', 'categoryName', 'categoryFullName', 'subcategories', 'categoryUrl', 'input']

def check_category_folder_exists(path:str, folder: str) -> bool:
    with os.scandir(path) as entries:
        for entry in entries:
            if entry.is_dir() and entry.name == folder:
                return True
            else:
                continue
    return False


def create_json_product_categories(path: str, categories: list) -> None:
    data = read_json_file(path)
    for cat in categories:
      for i in range(0, len(data)):
            if data[i]["category"] == cat and check_category_folder_exists(path, cat):
                f = open(f"src/data/{cat}/{cat}.json", "a")
                f.write("[\n")
                json.dump(data[i], f, indent=2)
                f.write("]\n")


def remove_duplicated_categories(lst: list) -> list:
    return list(pd.Series(lst).drop_duplicates())


def read_json_file(path: str) -> list:
    with open(path, 'r', encoding="utf-8") as file:
        data = json.load(file)
    return data


def loop_over_dict(lst: list, dct: dict):
    store = []
    for l in lst:
        if l in dct:
            store.append((f"{l}", f"{dct[l]}"))
        else:
            continue
    return dict(store)

def extract_fields(data: list):
   for it in data:
       collect.append(loop_over_dict(headphones, it))


def main():
    list_to_update = ["PHONES", "SMART_WATCHES"]
    path = "src/data"
    for _ in list_to_update:
        with open(f"{path}/{_}/{_.lower()}.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        extract_fields(data)
        with open(f"{path}/{_}/short_{_.lower()}.json", "a", encoding="utf-8") as d:
            json.dump(collect, d)

if __name__ == "__main__":
    main()

