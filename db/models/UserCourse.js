'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserCourse = sequelize.define('UserCourse', {
        userId : {
            type: DataTypes.INTEGER,
            allownull: false,
            primaryKey: true
        },
        courseId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        }
      }, {
        timestamps: false
    })

    return UserCourse;
}