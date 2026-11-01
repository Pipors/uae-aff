import json
import os


categories = ["PHONES/phones.json", "SMART_WATCHES/smart_watches.json"]
new_categories = ["PHONES/last_phones.json", "SMART_WATCHES/last_smart_watches.json"]


def loop_over_dict(key: str, dct: dict):
    return ((f"{key}", dct[key]))


def read_json_file(path: str) -> list:
    with open(path, 'r', encoding="utf-8") as file:
        data = json.load(file)
    return data


def fill_blank(src_file , dest_file):
    '''
        Retrieve from the files that have detailed data the following fields 
        ['url',
         'asin',
         'position',
         'price',
         'stars',
         'reviewsCount',
         'thumbnailUrl',
         'categoryName',
         'categoryFullName',
         'subcategories',
         'categoryUrl',
         'input']
        phone_dict = {}
        
    '''
    f_dict = read_json_file(src_file)
    collect = []
    store = []
    head_key = ['url', 'asin', 'price', 'stars', 'reviewsCount', 'thumbnailUrl', 'input', 'position', 'categoryName', 'categoryFullName', 'categoryUrl', 'subcategories']
    for it in f_dict:
        for h in head_key:
            if h not in it:
                collect.append(loop_over_dict(h, it["bestsellerPageData"]))
            else:
                collect.append(loop_over_dict(h, it))
        collect.append(("name", it["title"]))
        collect.append(("numberOfOffers", 100))
        store.append(dict(collect))
    # print(collect)
    with open(dest_file, "a", encoding='utf-8') as v:
        json.dump(store, v)



def main():
    fill_blank(f"src/data/{categories[0]}", f"src/data/{new_categories[0]}")
    fill_blank(f"src/data/{categories[1]}", f"src/data/{new_categories[1]}")


if __name__ == "__main__":
    main()
