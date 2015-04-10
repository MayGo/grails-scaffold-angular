package defpackage

class ConstraintHelper {

	static String getLongString(Integer length) {
		'a' * length
	}

	static String getEmail(Boolean valid) {
		valid ? 'foo@bar.gov' : 'foo@m'
	}

	static String getUrl(Boolean valid) {
		valid ? 'http://www.google.com' : 'http:/ww.helloworld.com'
	}

	static String getCreditCard(Boolean valid) {
		valid ? '4111111111111111' : '41014'
	}

	static BigDecimal getScale(int scale) {
		new BigDecimal(120, scale)
	}

	static void validateConstraints(obj, field, error) {
		def validated = obj.validate()
		if (error && error != 'valid') {
			assert !validated
			assert obj.errors[field]
			assert error == obj.errors[field]
		} else {
			assert !obj.errors[field]
		}
	}
}
