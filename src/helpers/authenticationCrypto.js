import crypto from "crypto-js";

export const encryptToken = (cipherText) => {
	if (!cipherText) {
		return undefined;
	}
	try {
		const encryptData = crypto.AES.encrypt(
			cipherText,
			process.env.REACT_APP_SECRET_KEY
		).toString();
		return encryptData;
	} catch (error) {
		return undefined;
	}
};

export const decryptToken = (cipherText) => {
	if (!cipherText) {
		return undefined;
	}
	try {
		const bytes = crypto.AES.decrypt(
			cipherText,
			process.env.REACT_APP_SECRET_KEY
		);
		const decryptedData = bytes.toString(crypto.enc.Utf8);
		return decryptedData;
	} catch (error) {
		return undefined;
	}
};
