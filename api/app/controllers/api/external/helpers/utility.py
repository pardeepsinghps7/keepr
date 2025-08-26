import csv

def read_csv_and_print(filename: str):
    rows = []
    try:
        with open(filename, mode="r", newline="", encoding="utf-8") as file:
            reader = csv.reader(file)
            for row in reader:
                rows.append(row)  # collect rows instead of just printing
        return rows
    except FileNotFoundError:
        return None