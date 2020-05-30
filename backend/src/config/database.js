module.exports = {
  dialect: 'postgress',
  host: 'localhost',
  username: 'postgress',
  password: 'docker',
  database: 'fastfeet',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
