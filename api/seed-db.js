
var schools = [
    {
        '_id':            ObjectId("54739d066dd9a7ae6d02bce1"),
        'fullName':       'A Test School',
        'shortName':      'aTest',
        'initials':       '01',
        'city':           'Fooville',
        'state':          'NY',
        'zip':            '10001',
        'division':       '1',
        'mascot':         'Foo',
        'logoColorDark':  '#000',
        'logoColorLight': '#fff',
        'storeLink':      ''
    },
    {
        '_id':            ObjectId("54739d066dd9a7ae6d02bce2"),
        'fullName':       'Another Test School',
        'shortName':      'bTest',
        'initials':       '02',
        'city':           'Barville',
        'state':          'NY',
        'zip':            '10010',
        'division':       '1',
        'mascot':         'Foobar',
        'logoColorDark':  '#333',
        'logoColorLight': '#999',
        'storeLink':      ''
    },
    {
        '_id':            ObjectId("54739d066dd9a7ae6d02bce3"),
        'fullName':       'Testy McTest Vocational School for the Socially Inept',
        'shortName':      'test',
        'initials':       'Wut',
        'city':           'Jersey City',
        'state':          'NJ',
        'zip':            '07302',
        'division':       '1',
        'mascot':         'HoodRat',
        'logoColorDark':  '#191970',
        'logoColorLight': '#dedede',
        'storeLink':      ''
    }
];db.schools.insert( schools );

var teams = [
    {
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce1"),
        'sport':    'Football',
        'season':   'Fall',
        'level':    'Varsity',
        'gender':   'Male',
        'mascot':   'Stay Puf\'t Marshmallow Man'
    },
    {
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce3"),
        'sport':    'Basketball',
        'season':   'Winter',
        'level':    'Varsity',
        'gender':   'Female',
        'mascot':   'Poison Ivy'
    },
    {
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce3"),
        'sport':    'Basketball',
        'season':   'Winter',
        'level':    'Varsity',
        'gender':   'Male',
        'mascot':   'Batman'
    },
    {
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce1"),
        'sport':    'Baseball',
        'season':   'Spring',
        'level':    'Freshman',
        'gender':   'Male',
        'mascot':   'Joe Boo'
    },
    {
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce2"),
        'sport':    'Softball',
        'season':   'Spring',
        'level':    'JV',
        'gender':   'Female',
        'mascot':   'Fish Head'
    }
];db.teams.insert( teams );
