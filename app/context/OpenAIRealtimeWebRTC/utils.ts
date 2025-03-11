import { Logger, LogLevel, LogMessage, SessionConfig } from './types';

export async function createNewVoiceChatSession(updatedConfig: SessionConfig) {
  try {
    const response = await fetch('/api/chat/live-session/new', {
      method: 'POST',
      body: JSON.stringify(updatedConfig),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Failed to create new voice chat session:', error);
    throw error;
  }
}

const createLogMessage = (
  level: LogLevel,
  message: string,
  meta?: { sessionId?: string; data?: unknown; error?: Error },
): LogMessage => ({
  level,
  message,
  sessionId: meta?.sessionId,
  timestamp: new Date().toISOString(),
  data: meta?.data,
  error: meta?.error,
});

export const createNoopLogger = (): Logger => ({
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
});

export const createConsoleLogger = (): Logger => ({
  debug: (message, meta) => {
    console.debug(createLogMessage(LogLevel.DEBUG, message, meta));
  },
  info: (message, meta) => {
    console.info(createLogMessage(LogLevel.INFO, message, meta));
  },
  warn: (message, meta) => {
    console.warn(createLogMessage(LogLevel.WARN, message, meta));
  },
  error: (message, meta) => {
    console.error(createLogMessage(LogLevel.ERROR, message, meta));
  },
});

// Optional: Create a default logger that can be used throughout the application
export const defaultLogger =
  process.env.NODE_ENV === 'development' ? createConsoleLogger() : createNoopLogger();
