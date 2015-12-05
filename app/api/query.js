// app/api/query.js

module.exports = function(db) {

	return {
		register: function(first, last, email, hash, callback) {
			db.query('INSERT INTO User (First, Last, Email, Password) VALUES (?,?,?,?)', [first, last, email, hash], callback);
		},

		getHash: function(email, callback) {
			db.query('SELECT Password FROM User u WHERE u.email = ?', [email], callback);
		},

		newMeeting: function(meetings, callback) {
			db.query('', meetings, callback);
		},

		getScope: function(user, callback) {
			db.query("(SELECT 'student' AS Role, NULL AS National, s.Chapter, o.Admin, o.Title FROM Student s LEFT JOIN Office o ON s.Email = ? AND o.Email = s.Email) " +
						"UNION " +
						"(SELECT 'advisor' AS Role, NULL AS National, a.Chapter, NULL AS Admin, NULL AS Title FROM Advisor a WHERE a.Email = ?) " +
						"UNION " +
						"(SELECT 'employee' AS Role, e.Nationals, NULL AS Chapter, NULL AS Admin, NULL AS Title FROM Employee e WHERE e.Email = ?) " +
						"UNION " +
						"(SELECT 'admin' AS Role, NULL AS National, NULL AS Chapter, NULL AS Admin, NULL AS Title FROM Admin a WHERE a.Email = ?)", 
						[user, user, user, user], callback);
		},

		getSubPositions: function(chapter, title, callback) {
			db.query('SELECT p.SubChapter Chapter, p.SubOffice Title FROM Permissions p WHERE p.HeadChapter = ? AND p.HeadOffice = ?', [chapter, title], callback);
		},

		addToken: function(token, user, expiration, callback) {
			db.query('INSERT INTO Token VALUES(?, ?, ?)' , [token, user, expiration], callback);
		},

		getChapter: function(chapID, callback) {
			db.query('SELECT * FROM Chapter C WHERE C.ID = ?', [chapID], callback);
		},

		getAllUsers: function(pageNum, pageSize, searchString, callback) {
			db.query('SELECT U.First, U.Last, U.Email, U.Avatar FROM User U WHERE U.First LIKE ?% OR U.Last LIKE ?% OR U.Email LIKE ?% LIMIT ?, ?', [searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		getUserByChapter: function(pageNum, pageSize, searchString, chapID, callback) {
			db.query('SELECT U.First, U.Last, U.Email, U.Avatar FROM User U, Chapter C WHERE C.ID = ? AND (U.First LIKE ?% OR U.Last LIKE ?% OR U.Email LIKE ?%) LIMIT ?, ?', [chapID, searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		getUserByNational: function(pageNum, pageSize, searchString, natName, callback) {
			db.query('SELECT U.First, U.Last, U.Email, U.Avatar FROM User U, National N WHERE N.Name = ? AND (U.First LIKE ?% OR U.Last LIKE ?% OR U.Email LIKE ?%) LIMIT ?, ?', [natName, searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		getUserByStudentRole: function(pageNum, pageSize, searchString, callback) {
			db.query('SELECT U.First, U.Last, U.Email, U.Avatar FROM User U, Student S WHERE U.Email = S.Email AND (U.First LIKE ?% OR U.Last LIKE ?% OR U.Email LIKE ?%) LIMIT ?, ?', [searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		getUserByAdminRole: function(pageNum, pageSize, searchString, callback) {
			db.query('SELECT U.First, U.Last, U.Email, U.Avatar FROM User U, Admin A WHERE U.Email = A.Email AND (U.First LIKE ?% OR U.Last LIKE ?% OR U.Email LIKE ?%) LIMIT ?, ?', [searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		getUserByEmployeeRole: function(pageNum, pageSize, searchString, callback) {
			db.query('SELECT U.First, U.Last, U.Email, U.Avatar FROM User U, Employee E WHERE U.Email = E.Email AND (U.First LIKE ?% OR U.Last LIKE ?% OR U.Email LIKE ?%) LIMIT ?, ?', [searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		getUserByAdvisorRole: function(pageNum, pageSize, searchString, callback) {
			db.query('SELECT U.First, U.Last, U.Email, U.Avatar FROM User U, Advisor A WHERE U.Email = A.Email AND (U.First LIKE ?% OR U.Last LIKE ?% OR U.Email LIKE ?%) LIMIT ?, ?', [searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},	

		getUserByStudentRoleChapter: function(pageNum, pageSize, searchString, chapID, callback) {
			db.query('SELECT U.First, U.Last, U.Email, U.Avatar FROM User U, Student S, Chapter C WHERE U.Email = S.Email AND C.ID = ? AND (U.First LIKE ?% OR U.Last LIKE ?% OR U.Email LIKE ?%) LIMIT ?, ?', [chapID, searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		getUserByAdvisorRoleChapter: function(pageNum, pageSize, searchString, chapID, callback) {
			db.query('SELECT U.First, U.Last, U.Email, U.Avatar FROM User U, Advisor A, Chapter C WHERE U.Email = A.Email AND C.ID = ? AND (U.First LIKE ?% OR U.Last LIKE ?% OR U.Email LIKE ?%) LIMIT ?, ?', [chapID, searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		getUserByStudentRoleNational: function(pageNum, pageSize, searchString, natName, callback) {
			db.query('SELECT U.First, U.Last, U.Email, U.Avatar FROM User U, Student S, National N WHERE U.Email = S.Email AND N.Name = ? AND (U.First LIKE ?% OR U.Last LIKE ?% OR U.Email LIKE ?%) LIMIT ?, ?', [natName, searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		getUserByAdvisorRoleNational: function(pageNum, pageSize, searchString, natName, callback) {
			db.query('SELECT U.First, U.Last, U.Email, U.Avatar FROM User U, Advisor A, National N WHERE U.Email = A.Email AND N.Name = ? AND (U.First LIKE ?% OR U.Last LIKE ?% OR U.Email LIKE ?%) LIMIT ?, ?', [natName, searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		getUserByEmployeeRoleNational: function(pageNum, pageSize, searchString, natName, callback) {
			db.query('SELECT U.First, U.Last, U.Email, U.Avatar FROM User U, Employee E, National N WHERE U.Email = E.Email AND N.Name = ? AND (U.First LIKE ?% OR U.Last LIKE ?% OR U.Email LIKE ?%) LIMIT ?, ?', [natName, searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		removeUser: function(email, callback) {
			db.query('DELETE FROM User U WHERE U.Email = ?', [email], callback);
		},	

		removeInvite: function(email, callback) {
			db.query('DELETE FROM Invite I WHERE I.Email = ?', [email], callback);
		},	

		removeChapter: function(chapID, callback) {
			db.query('DELETE FROM Chapter C WHERE C.ID = ?', [chapID], callback);
		},

		removeNational: function(natName, callback) {
			db.query('DELETE FROM National N WHERE N.Name = ?', [natName], callback);
		},				

		removeMeeting: function(mtgID, callback) {
			db.query('DELETE FROM Meeting M WHERE M.ID = ?', [mtgID], callback);
		},

		removeReport: function(reportID, callback) {
			db.query('DELETE FROM Report R WHERE R.ID = ?', [reportID], callback);
		},		

		removePosition: function(posTitle, chapID, callback) {
			db.query('DELETE FROM Office O WHERE O.Title = ? AND O.Chapter = ?', [posTitle, chapID], callback);
		},

		//removeUserFromChapter: function(chapID, email, callback) {
		//	db.query('DELETE ')
		//},

		getAllChapters: function(pageNum, pageSize, searchString, callback) {
			db.query('SELECT C.Name FROM Chapter C WHERE C.Name LIKE ?% OR C.SchoolName LIKE ?% OR C.Nationals LIKE ?% LIMIT ?, ?', [searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		}, 

		getChapterByID: function(chapID, callback) {
			db.query('SELECT C.Name FROM Chapter C WHERE C.ID = ?', [chapID], callback);
		},	

		getChapterByNational: function(pageNum, pageSize, natName, callback) {
			db.query('SELECT C.Name FROM Chapter C WHERE C.Nationals = ? LIMIT ?, ?', [natName, (pageNum-1)*pageSize, pageSize], callback);
		},

		getChapterByUser: function(pageNum, pageSize, email, callback) {
			db.query("(SELECT C.Name FROM Chapter C, Advisor A WHERE C.ID = A.Chapter AND A.Email = ?) LIMIT ?, ?" +
					 "UNION" +
					 "(SELECT C.Name FROM Chapter C, Student S WHERE C.ID = S.Chapter AND S.Email = ?) LIMIT ?, ?",
					 [email, (pageNum-1)*pageSize, pageSize, email, (pageNum-1)*pageSize, pageSize], callback);
		},

		getAllNationals: function(pageNum, pageSize, searchString, callback) {
			db.query('SELECT N.Name FROM National N WHERE N.Name LIKE ?% LIMIT ?, ?', [searchString, (pageNum-1)*pageSize, pageSize], callback);
		}, 

		getNationalByChapID: function(chapID, callback) {
			db.query('SELECT C.Nationals FROM Chapter C WHERE C.ID = ?', [chapID], callback);
		},

		getNationalByUser: function(pageNum, pageSize, email, callback) {
			db.query("(SELECT C.Nationals FROM Chapter C, Advisor A,  WHERE C.ID = A.Chapter AND A.Email = ?) LIMIT ?, ?" +
					 "UNION" +
					 "(SELECT C.Nationals FROM Chapter C, Student S WHERE C.ID = S.Chapter AND S.Email = ?) LIMIT ?, ?" +
					 "UNION" +
					 "(SELECT E.Nationals FROM Employee E WHERE E.Email = ?) LIMIT ?, ?",
					 [email, (pageNum-1)*pageSize, pageSize, email, (pageNum-1)*pageSize, pageSize, email, (pageNum-1)*pageSize, pageSize], callback);
		},

		getPositionsByChapter: function(pageNum, pageSize, chapID, callback) {
			db.query('SELECT O.Title FROM Office O WHERE O.Chapter = ? LIMIT ?, ?', [chapID, (pageNum-1)*pageSize, pageSize], callback);
		},

		getPositionByUser: function(email, callback) {
			db.query('SELECT O.Title FROM Office O WHERE O.Email LIKE ?%', [email], callback);
		},	

		getPositionByTitle: function(chapID, posTitle, callback) {
			db.query('SELECT O.Title FROM Office O WHERE O.Title LIKE ?% AND O.Chapter = ?', [posTitle, chapID], callback);
		},

		getInvitesByChapter: function(pageNum, pageSize, chapID, searchString, callback) {
			db.query('SELECT I.Email FROM Invite I WHERE I.Chapter = ? AND (I.Position LIKE ?% OR I.Nationals LIKE ?% OR I.Role LIKE ?% LIMIT ?, ?', [chapID, searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		getMeetingByDay: function(mtgDay, callback) {
			db.query('SELECT M.Day FROM Meeting M WHERE M.Day = ?', [mtgDay], callback);
		},

		getMeetingByChapter: function(chapID, callback) {
			db.query('SELECT M.Day FROM Meeting M WHERE M.Chapter = ?', [chapID], callback);
		},	

		getMeetingByID: function(mtgID, callback)	{
			db.query('SELECT M.Day FROM Meeting M WHERE M.ID = ?', [mtgID], callback);
		},

		//user can search by title of report, position of the person who wrote the report, or the text within the report
		getReportsByChapter: function(pageNum, pageSize, searchString, chapID, callback)	{
			db.query('SELECT R.Title FROM Report R WHERE R.Chapter = ? AND (R.Title LIKE ?% OR R.Office LIKE ?% or R.Html LIKE %?% LIMIT ?, ?', [chapID, searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);
		},

		getReportByPosition: function(posTitle, callback) {
			db.query('SELECT R.Title FROM Report R WHERE R.Office = ?' [posTitle], callback);
		},

		getReportsByMeeting: function(pageNum, pageSize, mtgID, searchString, callback)	{
			db.query('SELECT R.Title FROM Report R WHERE R.Meeting = ? AND (R.Title LIKE ?% OR R.Office LIKE ?% or R.Html LIKE %?% LIMIT ?, ?', [mtgID, searchString, searchString, searchString, (pageNum-1)*pageSize, pageSize], callback);			
		},

		getReportByID: function(ID, callback) {
			db.query('SELECT R.Title FROM Report R WHERE R.ID = ?', [ID], callback);
		},

		editUserName: function(fname, lname, email, callback) {
			db.query('UPDATE User SET First=?, Last=? WHERE Email=?', [fname, lname, email], callback);
		},

		editUserEmail: function(new_email, old_email, callback) {
			db.query('UPDATE User SET Email=? WHERE Email=?', [new_email, old_email], callback);
		}					

	};
};