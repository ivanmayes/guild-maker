
var events = [
    {
        'name':         'RandomPractice',
        'schoolIds':    [ObjectId("54739d066dd9a7ae6d02bce3")],
        'teamIds':      [ObjectId("547cc96f19a4863d136ccb46")],
        'homeSchoolId': ObjectId("54739d066dd9a7ae6d02bce3"),
        'homeTeamId':   ObjectId("547cc96f19a4863d136ccb46"),
        'type':         'practice',
        'description':  'A random practice that occurs randomly',
        'date':         new Date( 2015 , 0 , 15 ),
        'startTime':    new Date( 2015 , 0 , 15 , 16 , 0 ),
        'endTime':      new Date( 2015 , 0 , 15 , 18 , 30 ),
        'rescheduled':  true,
        'dateAdded':    Date.now(),
        'locationId':   '',
        'score':        '',
        'stats':        ''
    },
    {
        'name':         'gametime',
        'schoolIds':    [ObjectId("54739d066dd9a7ae6d02bce3"),ObjectId("54739d066dd9a7ae6d02bce2")],
        'teamIds':      [ObjectId("547cc96f19a4863d136ccb47"),ObjectId("547cc96f19a4863d136ccb52")],
        'homeSchoolId': ObjectId("54739d066dd9a7ae6d02bce3"),
        'homeTeamId':   ObjectId("547cc96f19a4863d136ccb47"),
        'type':         'game',
        'description':  'an actual game',
        'date':         new Date( 2015 , 0 , 17 ),
        'startTime':    new Date( 2015 , 0 , 17 , 13 , 30 ),
        'endTime':      new Date( 2015 , 0 , 17 , 18 , 0 ),
        'rescheduled':  false,
        'dateAdded':    Date.now(),
        'locationId':   '',
        'score':        '',
        'stats':        ''
    },
    {
        'name':         'foo',
        'schoolIds':    [ObjectId("54739d066dd9a7ae6d02bce1"),ObjectId("54739d066dd9a7ae6d02bce2"),ObjectId("54739d066dd9a7ae6d02bce3")],
        'teamIds':      [ObjectId("547cc96f19a4863d136ccb45"),ObjectId("547cc96f19a4863d136ccb46"),ObjectId("547cc96f19a4863d136ccb47"),ObjectId("547cc96f19a4863d136ccb48"),ObjectId("547cc96f19a4863d136ccb49"),ObjectId("547cc96f19a4863d136ccb50"),ObjectId("547cc96f19a4863d136ccb51"),ObjectId("547cc96f19a4863d136ccb52"),ObjectId("547cc96f19a4863d136ccb53"),ObjectId("547cc96f19a4863d136ccb54")],
        'homeSchoolId': ObjectId("54739d066dd9a7ae6d02bce1"),
        'homeTeamId':   ObjectId("547cc96f19a4863d136ccb45"),
        'type':         'foo',
        'description':  'all your base are belong to us',
        'date':         new Date( 2014 , 11 , 31 ),
        'startTime':    '',
        'endTime':      '',
        'rescheduled':  false,
        'dateAdded':    Date.now(),
        'locationId':   '',
        'score':        '',
        'stats':        ''
    }
];db.events.insert( events );

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
        '_id':      ObjectId("547cc96f19a4863d136ccb45"),
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce1"),
        'sport':    'Football',
        'season':   'Fall',
        'level':    'Varsity',
        'gender':   'Male',
        'mascot':   'Stay Puf\'t Marshmallow Man'
    },
    {
        '_id':      ObjectId("547cc96f19a4863d136ccb46"),
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce3"),
        'sport':    'Basketball',
        'season':   'Winter',
        'level':    'Varsity',
        'gender':   'Female',
        'mascot':   'Poison Ivy'
    },
    {
        '_id':      ObjectId("547cc96f19a4863d136ccb47"),
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce3"),
        'sport':    'Basketball',
        'season':   'Winter',
        'level':    'Varsity',
        'gender':   'Male',
        'mascot':   'Batman'
    },
    {
        '_id':      ObjectId("547cc96f19a4863d136ccb48"),
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce1"),
        'sport':    'Baseball',
        'season':   'Spring',
        'level':    'Freshman',
        'gender':   'Male',
        'mascot':   'Joe Boo'
    },
    {
        '_id':      ObjectId("547cc96f19a4863d136ccb49"),
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce2"),
        'sport':    'Softball',
        'season':   'Spring',
        'level':    'JV',
        'gender':   'Female',
        'mascot':   'Fish Head'
    },
    {
        '_id':      ObjectId("547cc96f19a4863d136ccb50"),
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce2"),
        'sport':    'Football',
        'season':   'Fall',
        'level':    'Varsity',
        'gender':   'Male',
        'mascot':   'Fish Head'
    },
    {
        '_id':      ObjectId("547cc96f19a4863d136ccb51"),
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce1"),
        'sport':    'Basketball',
        'season':   'Winter',
        'level':    'Varsity',
        'gender':   'Female',
        'mascot':   'Poison Ivy'
    },
    {
        '_id':      ObjectId("547cc96f19a4863d136ccb52"),
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce2"),
        'sport':    'Basketball',
        'season':   'Winter',
        'level':    'Varsity',
        'gender':   'Male',
        'mascot':   'Fish Head'
    },
    {
        '_id':      ObjectId("547cc96f19a4863d136ccb53"),
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce3"),
        'sport':    'Baseball',
        'season':   'Spring',
        'level':    'Freshman',
        'gender':   'Male',
        'mascot':   'Robin'
    },
    {
        '_id':      ObjectId("547cc96f19a4863d136ccb54"),
        'schoolId': ObjectId("54739d066dd9a7ae6d02bce3"),
        'sport':    'Softball',
        'season':   'Spring',
        'level':    'JV',
        'gender':   'Female',
        'mascot':   'Joker'
    }
];db.teams.insert( teams );
// var teams = [{'_id': ObjectId("547cc96f19a4863d136ccb45"),'schoolId': ObjectId("54739d066dd9a7ae6d02bce1"),'sport': 'Football','season': 'Fall','level': 'Varsity','gender': 'Male','mascot': 'Stay Puf\'t Marshmallow Man'},{'_id': ObjectId("547cc96f19a4863d136ccb46"),'schoolId': ObjectId("54739d066dd9a7ae6d02bce3"),'sport': 'Basketball','season': 'Winter','level': 'Varsity','gender': 'Female','mascot': 'Poison Ivy'},{'_id': ObjectId("547cc96f19a4863d136ccb47"),'schoolId': ObjectId("54739d066dd9a7ae6d02bce3"),'sport': 'Basketball','season': 'Winter','level': 'Varsity','gender': 'Male','mascot': 'Batman'},{'_id': ObjectId("547cc96f19a4863d136ccb48"),'schoolId': ObjectId("54739d066dd9a7ae6d02bce1"),'sport': 'Baseball','season': 'Spring','level': 'Freshman','gender': 'Male','mascot': 'Joe Boo'},{'_id': ObjectId("547cc96f19a4863d136ccb49"),'schoolId': ObjectId("54739d066dd9a7ae6d02bce2"),'sport': 'Softball','season': 'Spring','level': 'JV','gender': 'Female','mascot': 'Fish Head'},{'_id': ObjectId("547cc96f19a4863d136ccb50"),'schoolId': ObjectId("54739d066dd9a7ae6d02bce2"),'sport': 'Football','season': 'Fall','level': 'Varsity','gender': 'Male','mascot': 'Fish Head'},{'_id': ObjectId("547cc96f19a4863d136ccb51"),'schoolId': ObjectId("54739d066dd9a7ae6d02bce1"),'sport': 'Basketball','season': 'Winter','level': 'Varsity','gender': 'Female','mascot': 'Poison Ivy'},{'_id': ObjectId("547cc96f19a4863d136ccb52"),'schoolId': ObjectId("54739d066dd9a7ae6d02bce2"),'sport': 'Basketball','season': 'Winter','level': 'Varsity','gender': 'Male','mascot': 'Fish Head'},{'_id': ObjectId("547cc96f19a4863d136ccb53"),'schoolId': ObjectId("54739d066dd9a7ae6d02bce3"),'sport': 'Baseball','season': 'Spring','level': 'Freshman','gender': 'Male','mascot': 'Robin'},{'_id': ObjectId("547cc96f19a4863d136ccb54"),'schoolId': ObjectId("54739d066dd9a7ae6d02bce3"),'sport': 'Softball','season': 'Spring','level': 'JV','gender': 'Female','mascot': 'Joker'}];db.teams.insert( teams );