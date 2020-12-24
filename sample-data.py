
import csv
import random
import decimal
import time
from datetime import datetime

SENSORS = [1,2]
MONTH_IN_SECONDS = 2629746
FORMAT = '%Y-%m-%d %H:%M:%S'

with open('data.csv', 'w') as file:
    writer = csv.writer(file)
    
    start = time.time() - MONTH_IN_SECONDS
    for i in range(0,10000):
        timestr = datetime.fromtimestamp(start + i * 60).strftime(FORMAT)
        for s in SENSORS:
            # Random reading value
            randval = decimal.Decimal(random.randint(2000,2500))/100
            writer.writerow([s, randval, timestr])
