import log from 'loglevel'

const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL ?? (import.meta.env.PROD ? 'info' : 'trace')

export const logger = log.getLogger('my_game')
logger.setLevel(LOG_LEVEL)