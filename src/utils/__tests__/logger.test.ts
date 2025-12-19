import { ConsoleLogger, LogLevel, createLogger } from '../logger';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let stderrWriteSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    stderrWriteSpy = jest.spyOn(process.stderr, 'write').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create logger with correct level', () => {
    const logger = createLogger(true);
    // @ts-ignore - accessing private property for testing
    expect(logger.level).toBe(LogLevel.DEBUG);

    const loggerInfo = createLogger(false);
    // @ts-ignore
    expect(loggerInfo.level).toBe(LogLevel.INFO);
  });

  test('should log info messages when level is INFO', () => {
    const logger = new ConsoleLogger(LogLevel.INFO);
    logger.info('test message');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO]'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('test message'));
  });

  test('should not log debug messages when level is INFO', () => {
    const logger = new ConsoleLogger(LogLevel.INFO);
    logger.debug('test message');
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  test('should use stderr when configured', () => {
    const logger = new ConsoleLogger(LogLevel.INFO, true);
    logger.info('test message');
    expect(stderrWriteSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO]'));
    expect(stderrWriteSpy).toHaveBeenCalledWith(expect.stringContaining('test message'));
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
