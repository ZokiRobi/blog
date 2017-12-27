var records = [
    { id: 1, username: 'Admin', password: 'admin', displayName: 'Admin', emails: [ { value: 'admin@example.com' } ] },
	{ id: 2, username: 'User', password: 'user', displayName: 'User', emails: [ { value: 'user@example.com' } ]}
];
exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
      for (var i = 0, len = records.length; i < len; i++) {
        var record = records[i];
        if (record.username === username) {
          return cb(null, record);
        }
      }
      return cb(null, null);
    });
  }