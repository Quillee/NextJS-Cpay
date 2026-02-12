from json import dump, load
from re import match
from datetime import datetime
from pprint import pprint

# sorry for the python, just thought it would be much easier to group
# Python 3.9+ is required to run
# use pnmp generate:activity to run this script
def main():
    pays = []
    with open('scripts/pays.json', 'r') as fh:
        pays = load(fh)
    if len(pays) == 0:
        print('[Error] reading file... exiting')
        exit()

    months = ['None', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
    group_by_month = {}
    for pay in pays['pays']:
        pprint(pay)
        month = months[datetime.strptime(pay['created_at'], '%Y-%m-%d').month]
        if month not in group_by_month: 
            group_by_month[month] = 0

        group_by_month[month] += pay['amount'] 
    with open('scripts/activity.json', 'w') as fh:
        dump([ {'month': key, 'activity': group_by_month[key] } for key in group_by_month]
, fh, indent=2)


if __name__ == '__main__':
    main()
