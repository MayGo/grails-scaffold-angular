package defpackage

import grails.converters.JSON
import grails.transaction.Transactional
import org.apache.commons.io.IOUtils
import org.codehaus.groovy.grails.commons.GrailsApplication
import org.springframework.web.multipart.MultipartFile

@Transactional(readOnly = true)
class UploadController {

	static responseFormats = ['json']
	GrailsApplication grailsApplication

	def index() {

		String fileName = request.fileNames[0]

		log.info("Uploading file $fileName started.")

		MultipartFile uploadedFile = request.getFile(fileName)

		if (!uploadedFile) {
			throw new IllegalArgumentException("No file named: $fileName")
		}
		if (uploadedFile.empty) {
			throw new IllegalArgumentException("${uploadedFile.originalFilename} is empty and cannot be imported")
		}
		String originalFileName = uploadedFile.originalFilename
		log.info "File name : ${uploadedFile.originalFilename}, File size : ${uploadedFile.size}"

		InputStream inputStream = uploadedFile.inputStream

		def fileStorageLocation = grailsApplication.config.uploadFolder ?: System.getProperty('java.io.tmpdir')

		File dir = new File(fileStorageLocation)
		File file = new File(fileStorageLocation, originalFileName)
		//This support both overriding and creating new file
		//If two of these fails, that means got some internal issue. May be new file creation permissions issue
		if ((dir.exists() || dir.createNewFile()) && (file.exists() || file.createNewFile())) {

			//to close the fileOutStream, opening it using withOutStream closure
			file.withOutputStream { fos ->
				IOUtils.copyLarge(inputStream, fos)
				fos.close()
			}
		} else {
			throw new IllegalStateException("Error while creating  ${originalFileName} at ${fileStorageLocation}")
		}

		Map fileData = [
				'realFileName': originalFileName
		]

		if (params.sendBytesBack) {
			fileData.fileAsBytes = uploadedFile.bytes
		}
		render fileData as JSON
	}
}
