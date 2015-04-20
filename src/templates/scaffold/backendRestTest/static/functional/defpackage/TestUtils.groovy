package defpackage

import java.text.SimpleDateFormat

trait TestUtils {

	SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ")
	SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ")
	Date today = new Date().clearTime()

	String getTodayForInput() {
		return inputFormat.format(today)
	}

	String getTodayForOutput() {
		return outputFormat.format(today)
	}
}