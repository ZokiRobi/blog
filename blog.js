//TODO: Refaktorisati da se iscitavanja bloga rade iz fajl sistema -> blogs.json

var entries = [
{"id":1, "title":"Prvi Blog", "body":"Sadrzaj prvog bloga", "published":"1/1/2017"},
{"id":2, "title":"Drugi Blog", "body":"Sadrzaj drugog bloga", "published":"2/2/2017"},
{"id":3, "title":"Treci Blog", "body":"Sadrzaj treceg bloga", "published":"3/3/2017"},
{"id":4, "title":"Cetvrti Blog", "body":"Sadrzaj cetvrtog bloga", "published":"4/4/2017"},
{"id":5, "title":"Peti Blog", "body":"Sadrzaj petog bloga", "published":"5/5/2017"},
{"id":6, "title":"Sesti Blog", "body":"Sadrzaj sestog bloga", "published":"6/6/2017"}];


exports.getBlogEntries = function() {
	return entries;
}

exports.getBlogEntry = function(id) {
	for(var i=0; i<entries.length; i++) {
		if(entries[i].id == id) return entries[i];
	}
}

exports.saveEntries = function(newEntries){
	entries = newEntries;
}

exports.saveBlogs = function saveBlogs(blogs){
	entries = [];
	blogs.forEach(element => {
		entries.push(element);
	});
}