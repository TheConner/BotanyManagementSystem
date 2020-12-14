
import csv
import random
import decimal
import time

SENSORS = [1,2]


def str_time_prop(start, end, format, prop):
    """Get a time at a proportion of a range of two formatted times.

    start and end should be strings specifying times formated in the
    given format (strftime-style), giving an interval [start, end].
    prop specifies how a proportion of the interval to be taken after
    start.  The returned time will be in the specified format.
    """

    stime = time.mktime(time.strptime(start, format))
    etime = time.mktime(time.strptime(end, format))

    ptime = stime + prop * (etime - stime)

    return time.strftime(format, time.localtime(ptime))


def random_date(start, end, prop):
    # 2020-11-29 22:01:45.470209
    return str_time_prop(start, end, '%Y-%m-%d %H:%M:%S', prop)


with open('data.csv', 'w') as file:
    writer = csv.writer(file)
    for i in range(0,10000):
        randDate = random_date("2019-01-01 01:00:00", "2020-01-01 01:00:00", random.random())
        for s in SENSORS:
            randVal = decimal.Decimal(random.randint(2000,2500))/100
            writer.writerow([s, randVal, randDate])
