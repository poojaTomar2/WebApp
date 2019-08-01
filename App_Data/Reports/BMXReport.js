var s = {
	ReportTitle: "BMX Report",
	Query: "SELECT * FROM vwAssetList",
	PageLayout: {
		Landscape: true
	},
	"Columns": [
		{
			"Caption": "SerialNumber",
			"Text": "[Fields!SerialNumber.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.5in"
		},
		{
			"Caption": "Asset Type",
			"Text": "[Fields!AssetType.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.5in"
		},
		{
			"Caption": "Outlet",
			"Text": "[Fields!Location.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.5in"
		},
		{
			"Caption": "Outlet Code",
			"Text": "[Fields!LocationCode.Value]",
			"TextAlignHorz": "Center",
			"Width": "0.8in"
		},
		{
			"Caption": "Smart Device",
			"Text": "[Fields!SmartDeviceSerialNumber.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.0in"
		},
		{
			"Caption": "CoolerIoT Client",
			"Text": "[Fields!ClientName.Value]",
			"TextAlignHorz": "Center",
			"Width": "1.5in"
		},
		{
			"Caption": "City",
			"Text": "[Fields!City.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.0in"
		},
		{
			"Caption": "Street",
			"Text": "[Fields!Street.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.0in"
		},
		{
			"Caption": "Street 2",
			"Text": "[Fields!Street2.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.0in"
		},
		{
			"Caption": "State",
			"Text": "[Fields!State.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.0in"
		},
		{
			"Caption": "Country",
			"Text": "[Fields!Country.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.0in"
		},
		{
			"Caption": "CoolerType",
			"Text": "[Fields!CoolerType.Value]",
			"TextAlignHorz": "Center",
			"Width": "2.0in"
		}
	]
}