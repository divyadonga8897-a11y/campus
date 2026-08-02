export interface ParsedError {
  message: string;
  statusCode?: number;
  retryable: boolean;
}

export function parseApiError(error: any): ParsedError {
  if (!error) {
    return {
      message: "An unknown error occurred. Please try again.",
      retryable: true
    };
  }

  // Network error or fetch failed
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      message: "Unable to connect to the college backend server. Please verify your connection status and try again.",
      statusCode: 503,
      retryable: true
    };
  }

  // Timeout error
  if (error.name === "AbortError" || error.message?.includes("timeout")) {
    return {
      message: "The server response timed out. Please try again.",
      statusCode: 408,
      retryable: true
    };
  }

  // Custom status error responses
  if (error.statusCode) {
    if (error.statusCode === 401) {
      return {
        message: "Your administrator session has expired. Please log in again.",
        statusCode: 401,
        retryable: false
      };
    }
    if (error.statusCode === 403) {
      return {
        message: "Access forbidden. You do not possess the required credentials to perform this action.",
        statusCode: 403,
        retryable: false
      };
    }
    if (error.statusCode === 429) {
      return {
        message: "Rate limit exceeded. You have made too many requests. Please wait a minute before retrying.",
        statusCode: 429,
        retryable: true
      };
    }
  }

  return {
    message: error.message || "Something went wrong while connecting to the college server. Please try again later.",
    statusCode: error.statusCode || 500,
    retryable: true
  };
}
