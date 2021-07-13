import csv
from random import randrange
import json

size = 1000000
instance_prefix = "instance1"


# # capital table
# print("capital")

# with open("./data-generator/capital_"+instance_prefix+".csv", "w", newline='') as file:
#     writer = csv.writer(file)
#     writer.writerow(['capital_id', 'name', 'country_id'])
#     for i in range(size):
#         capital_id = instance_prefix+"_cp_"+str(i)
#         name = "capital_"+str(i)
#         country_id = instance_prefix+"_ct_"+str(i)
#         writer.writerow([capital_id, name, country_id])

# # publisher table
# print("publisher")

# with open("./data-generator/publisher_"+instance_prefix+".csv", "w", newline='') as file:
#     writer = csv.writer(file)
#     writer.writerow(['publisher_id', 'name'])
#     for i in range(size):
#         publisher_id = instance_prefix+"_pb_"+str(i)
#         name = "publisher_"+str(i)
#         writer.writerow([publisher_id, name])

# print('book')
# # book table
# with open("./data-generator/book_"+instance_prefix+".csv", "w", newline='') as file:
#     writer = csv.writer(file, delimiter=';')
#     writer.writerow(['book_id', 'name', 'country_ids', 'publisher_id'])
#     for i in range(size):
#         book_id = instance_prefix+"_bk_"+str(i)
#         name = "book"+str(i)
#         publisher_id = instance_prefix+"_pb_"+str(randrange(size))
#         country_ids = [str(instance_prefix+"_ct_"+str(i))]
#         if i+1<size:
#             country_ids.append(str(instance_prefix+"_ct_"+str(i+1)))
#         country_ids = json.dumps(country_ids, separators=(',', ':'))
#         writer.writerow([book_id, name, str(country_ids), publisher_id])

# print('country')
# # country
# with open("./data-generator/country_"+instance_prefix+".csv", "w", newline='') as file:
#     writer = csv.writer(file, delimiter=';')
#     writer.writerow(['country_id', 'name', 'book_ids'])
#     for i in range(size):
#         country_id = instance_prefix+"_ct_"+str(i)
#         name = "country"+str(i)
#         book_ids = [str(instance_prefix+"_bk_"+str(i))]
#         if i>0:
#             book_ids.append(str(instance_prefix+"_bk_"+str(i-1)))
#         book_ids = json.dumps(book_ids, separators=(',', ':'))
#         writer.writerow([country_id, name, str(book_ids)])

# local capital table
print("local capital")

with open("./data-generator/local_capital.csv", "w", newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['capital_id', 'name', 'country_id'])
    for i in range(size):
        capital_id = "local_cp_"+str(i)
        name = "capital_"+str(i)
        country_id = "local_ct_"+str(i)
        writer.writerow([capital_id, name, country_id])

# local publisher table
print("local publisher")

with open("./data-generator/local_publisher.csv", "w", newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['publisher_id', 'name'])
    for i in range(size):
        publisher_id = "local_pb_"+str(i)
        name = "publisher_"+str(i)
        writer.writerow([publisher_id, name])

print('local book')
# local book table
with open("./data-generator/local_book.csv", "w", newline='') as file:
    writer = csv.writer(file, delimiter=';')
    writer.writerow(['book_id', 'name', 'country_ids', 'publisher_id'])
    for i in range(size):
        book_id = "local_bk_"+str(i)
        name = "book"+str(i)
        publisher_id = "local_pb_"+str(randrange(size))
        country_ids = [str("local_ct_"+str(i))]
        if i+1<size:
            country_ids.append(str("local_ct_"+str(i+1)))
        country_ids = json.dumps(country_ids, separators=(',', ':'))
        writer.writerow([book_id, name, str(country_ids), publisher_id])

print('local country')
# local country
with open("./data-generator/local_country.csv", "w", newline='') as file:
    writer = csv.writer(file, delimiter=';')
    writer.writerow(['country_id', 'name', 'book_ids'])
    for i in range(size):
        country_id = "local_ct_"+str(i)
        name = "country"+str(i)
        book_ids = [str("local_bk_"+str(i))]
        if i>0:
            book_ids.append(str("local_bk_"+str(i-1)))
        book_ids = json.dumps(book_ids, separators=(',', ':'))
        writer.writerow([country_id, name, str(book_ids)])