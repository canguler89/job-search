'use strict';
module.exports = (sequelize, DataTypes) => {
  const Gig = sequelize.define('gig', {
    title: DataTypes.STRING,
    technologies: DataTypes.STRING,
    budget: DataTypes.STRING,
    description: DataTypes.STRING,
    contact_email: DataTypes.STRING,
  }, {});
  Gig.associate = function(models) {
    // associations can be defined here
  };
  return Gig;
};
