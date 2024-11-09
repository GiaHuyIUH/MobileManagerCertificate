// utils/validators.ts

// Utility function to test a regex pattern on a given text
const regex = (pattern: RegExp, text: string): boolean => {
    return pattern.test(text);
};

// Function to check if a number is exactly 10 digits
export const isTenDigitNumber = (text: string): boolean => {
    const pattern = /^\d{10}$/;
    return regex(pattern, text);
};

export const isBirthdate = (text: string): boolean => {
    // Kiểm tra định dạng ngày theo định dạng YYYY-MM-DD
    const inputDate = new Date(text);

    // Lấy ngày hôm nay và đặt giờ về 00:00:00 để chỉ so sánh ngày (không tính giờ, phút, giây)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Đặt giờ của ngày hôm nay về 00:00:00 UTC

    // So sánh ngày đầu vào với ngày hôm nay
    return inputDate < today; // Trả về true nếu ngày đầu vào nhỏ hơn ngày hôm nay

};

// Function to check if a course price is a positive number
export const isCoursePricePositive = (text: string): boolean => {
    const pattern = /^\d+(\.\d{1,2})?$/;
    return regex(pattern, text);
};

// Function to check if a string is a valid Ethereum wallet address
export const isWalletAddress = (text: string): boolean => {
    const pattern = /^0x[a-fA-F0-9]{40}$/;
    return regex(pattern, text);
};

// Function to check if a string is a valid email
export const isEmail = (text: string): boolean => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex(pattern, text);
};

// Function to check if a password meets specified requirements
export const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Export all functions as a default object for convenience
export default {
    isTenDigitNumber,
    isBirthdate,
    isCoursePricePositive,
    isWalletAddress,
    isEmail,
    isValidPassword
};
