var s = {
	ReportTitle: "Survey Summery",
	Query: "SELECT  * FROM vwSurveyDetailList",
	Groups: [
	{
		GroupField: "Fields!SurveyId.Value",
		GroupDescriptionField: "Survey Id [Fields!SurveyId.Value]",
		FooterRow: false,
		BackColor: "DarkCyan"
	}
	],
	PageLayout: {
		Landscape: true
	},
	"Columns": [
		{
			"Caption": "Survey Detail Id",
			"Text": "[Fields!SurveyDetailId.Value]",
			"TextAlignHorz": "Center",
			"GroupHeader": "{GroupDescription}",
			"GroupHeaderOptions": {
				"SpanAllCols": "true",
				"TextAlignHorz": "Left"
			},
			"Width": "1.2in"
		},
		{
			"Caption": "SurveyDateTime",
			"Text": "[Fields!SurveyDateTime.Value]",
			"TextAlignHorz": "Center",
			"Width": "3.0in"
		},
		{
			"Caption": "Latitude",
			"Text": "[Fields!Latitude.Value]",
			"TextAlignHorz": "Center",
			"Width": "1.0in"
		},
		{
			"Caption": "Longitude",
			"Text": "[Fields!Longitude.Value]",
			"TextAlignHorz": "Center",
			"Width": "1.0in"
		},
		{
			"Caption": "Question",
			"Text": "[Fields!Question.Value]",
			"TextAlignHorz": "Center",
			"Width": "3.8in"
		},
		{
			"Caption": "Question Type",
			"Text": "[Fields!QuestionType.Value]",
			"TextAlignHorz": "Center",
			"Width": "1.5in"
		},
		{
			"Caption": "Answer",
			"Text": "[Fields!Response.Value]",
			"TextAlignHorz": "Center",
			"Width": "1.8in"
		},
		{
			"Caption": "Point",
			"Text": "[Fields!Point.Value]",
			"TextAlignHorz": "Center",
			"Width": "1.8in"
		},
		{
			"Caption": "Survey Type",
			"Text": "[Fields!SurveyType.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.1in"
		},
		{
			"Caption": "Consumer",
			"Text": "[Fields!Username.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.0in"
		},
		{
			"Caption": "Over All Feedback",
			"Text": "[Fields!OverAllFeedback.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.5in"
		},
		{
			"Caption": "Outlet Name",
			"Text": "[Fields!OutletName.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.8in"
		},
		{
			"Caption": "Outlet Code",
			"Text": "[Fields!OutletCode.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.5in"
		},
		{
			"Caption": "Street",
			"Text": "[Fields!Street.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.8in"
		},
		{
			"Caption": "City",
			"Text": "[Fields!City.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.5in"
		},
		{
			"Caption": "Country",
			"Text": "[Fields!Country.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.8in"
		}
	]
}