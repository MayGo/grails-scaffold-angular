package defpackage

import java.text.SimpleDateFormat

trait TestUtils {

	SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSSZ")
	SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
	Date today = new Date().clearTime()

	String getTodayForInput() {
		return inputFormat.format(today)
	}

	String getTodayForOutput() {
		//return outputFormat.format(today)
		return today.time
	}
}