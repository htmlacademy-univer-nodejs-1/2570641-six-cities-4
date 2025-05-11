/**
 * Constructs a MongoDB connection URI
 * @param {string} host - Database host
 * @param {string} port - Database port
 * @param {string} dbname - Database name
 * @param {string} [username] - Optional username
 * @param {string} [password] - Optional password
 * @returns {string} MongoDB connection URI
 */
export const getURI = (
  host: string,
  port: string,
  dbname: string,
  username?: string,
  password?: string,
): string => {
  if (username && password) {
    return `mongodb://${username}:${password}@${host}:${port}/${dbname}?authSource=admin`;
  }

  return `mongodb://${host}:${port}/${dbname}`;
};
