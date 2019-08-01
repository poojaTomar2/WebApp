/* global: moment */
Cooler.DateOptions = {
	Now: function() { return new Date(); },
	TimeZone: function() {
		return moment().format('Z');
	},
	AddMinutes: function(date, number) {
		return moment(date).add(number, 'minutes').toDate();
	},
	AddHours: function (date, number) {
		return moment(date).add(number, 'hours').toDate();
	},
	AddDays: function (date, number) {
		return moment(date).add(number, 'days').toDate();
	},
	AddMonths: function (date, number) {
		return moment(date).add(number, 'months').toDate();
	},
	AddYears: function (date, number) {
		return moment(date).add(number, 'years').toDate();
	},
	GetStartDate: function(date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
	},
	GetEndDate: function(date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
	},
	DayStart: function() {
		return Cooler.DateOptions.GetStartDate(Cooler.DateOptions.Now());
	},
	DayEnd: function() {
		return Cooler.DateOptions.GetEndDate(Cooler.DateOptions.Now());
	},
	WeekStart: function() {
		var startOfweekDate = Cooler.DateOptions.getStartOfWeek(new Date(), 0);
		return Cooler.DateOptions.GetStartDate(startOfweekDate);
	},
	getStartOfWeek: function (dt, startOfWeek) {
		var diff = moment().weekday() - startOfWeek;
		if (diff < 0) {
			diff += 7;
		}
		return Cooler.DateOptions.AddDays(Cooler.DateOptions.Now(), (-1 * diff));
	},
	WeekEnd: function() {
		var weekStart = Cooler.DateOptions.WeekStart();
		return Cooler.DateOptions.GetEndDate(Cooler.DateOptions.AddDays(weekStart, (6)));
	},
	MonthStart: function() {
		var date = Cooler.DateOptions.Now();
		return Cooler.DateOptions.GetStartDate(new Date(date.getFullYear(), date.getMonth(), 1));
	},
	MonthEnd: function() {
		var date = Cooler.DateOptions.Now();
		return Cooler.DateOptions.GetEndDate(new Date(date.getFullYear(), date.getMonth(), Cooler.DateOptions.DaysInMonth()));
	},
	DaysInMonth: function(date) {
		date = date || new Date();
		return moment(date).daysInMonth();
	},
	YearStart: function() {
		var date = Cooler.DateOptions.Now();
		return Cooler.DateOptions.GetStartDate(new Date(date.getFullYear(), 0, 1));
	},
	YearEnd: function() {
		var date = Cooler.DateOptions.Now();
		return Cooler.DateOptions.GetEndDate(new Date(date.getFullYear(), 11, 31));
	},
	YesterdayStart: function() {
		return Cooler.DateOptions.GetStartDate(Cooler.DateOptions.AddDays(Cooler.DateOptions.Now(), -1));
	},
	YesterdayEnd: function() {
		return Cooler.DateOptions.GetEndDate(Cooler.DateOptions.AddDays(Cooler.DateOptions.Now(), -1));
	},
	DayBeforeYesterdayStart: function() {
		return Cooler.DateOptions.GetStartDate(Cooler.DateOptions.AddDays(Cooler.DateOptions.Now(), -2));
	},
	DayBeforeYesterdayEnd: function() {
		return Cooler.DateOptions.GetEndDate(Cooler.DateOptions.AddDays(Cooler.DateOptions.Now(), -2));
	},
	ThisDayLastWeekStart: function() {
		return Cooler.DateOptions.GetStartDate(Cooler.DateOptions.AddDays(Cooler.DateOptions.Now(), -7));
	},
	ThisDayLastWeekEnd: function() {
		return Cooler.DateOptions.GetEndDate(Cooler.DateOptions.AddDays(Cooler.DateOptions.Now(), -7));
	},
	PreviousWeekStart: function() {
		var weekStart = Cooler.DateOptions.WeekStart();
		return Cooler.DateOptions.GetStartDate(Cooler.DateOptions.AddDays(weekStart, -7));
	},
	PreviousWeekEnd: function() {
		var weekStart = Cooler.DateOptions.WeekStart();
		return Cooler.DateOptions.GetEndDate(Cooler.DateOptions.AddDays(weekStart, -1));
	},
	PreviousMonthStart: function() {
		var lastMonthDate = Cooler.DateOptions.AddMonths(Cooler.DateOptions.Now(), -1);
		return new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 1, 0, 0, 0);
	},
	PreviousMonthEnd: function() {
		var lastMonthDate = Cooler.DateOptions.AddMonths(Cooler.DateOptions.Now(), -1);
		return new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), Cooler.DateOptions.DaysInMonth(lastMonthDate), 23, 59, 59);
	},
	PreviousYearStart: function() {
		var yearStartDate = Cooler.DateOptions.AddYears(Cooler.DateOptions.Now(), -1);
		return new Date(yearStartDate.getFullYear(), 0, 1, 0, 0, 0);
	},
	PreviousYearEnd: function() {
		var yearStartDate = Cooler.DateOptions.AddYears(Cooler.DateOptions.Now(), -1);
		return new Date(yearStartDate.getFullYear(), 11, 31, 23, 59, 59);
	},
	Last15Minutes: function() {
		return Cooler.DateOptions.AddMinutes(Cooler.DateOptions.Now(), -15);
	},
	Last30Minutes: function() {
		return Cooler.DateOptions.AddMinutes(Cooler.DateOptions.Now(), -30);
	},
	Last1Hour: function() {
		return Cooler.DateOptions.AddHours(Cooler.DateOptions.Now(), -1);
	},
	Last4Hours: function() {
		return Cooler.DateOptions.AddHours(Cooler.DateOptions.Now(), -4);
	},
	Last12Hours: function() {
		return Cooler.DateOptions.AddHours(Cooler.DateOptions.Now(), -12);
	},
	Last24Hours: function() {
		return Cooler.DateOptions.AddHours(Cooler.DateOptions.Now(), -24);
	},
	Last7Days: function() {
		return Cooler.DateOptions.AddDays(Cooler.DateOptions.Now(), -7);
	},
	Last30Days: function() {
		return Cooler.DateOptions.AddDays(Cooler.DateOptions.Now(), -30);
	},
	Last60Days: function() {
		return Cooler.DateOptions.AddDays(Cooler.DateOptions.Now(), -60);
	},
	Last90Days: function() {
		return Cooler.DateOptions.AddDays(Cooler.DateOptions.Now(), -90);
	},
	Last6Months: function() {
		return Cooler.DateOptions.AddMonths(Cooler.DateOptions.Now(), -6);
	},
	Last1Year: function() {
		return Cooler.DateOptions.AddYears(Cooler.DateOptions.Now(), -1);
	},
	Last2Years: function() {
		return Cooler.DateOptions.AddYears(Cooler.DateOptions.Now(), -2);
	},
	Last5Years: function() {
		return Cooler.DateOptions.AddYears(Cooler.DateOptions.Now(), -5);
	},
	getFormattedDate: function (date) {
		var year = date.getFullYear();
		var month = (1 + date.getMonth()).toString();
		month = month.length > 1 ? month : '0' + month;
		var day = date.getDate().toString();
		day = day.length > 1 ? day : '0' + day;
		return year + '/' + month + '/' + day + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	}
}