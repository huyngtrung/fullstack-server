module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passWord: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Likes),
      {
        onDelete: "cascade",
      };

    Users.hasMany(models.Posts),
      {
        onDelete: "cascade",
      };
  };

  return Users;
};
