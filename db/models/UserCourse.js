'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserCourse = sequelize.define('UserCourse', {
        userId : {
            type: DataTypes.INTEGER,
            allownull: false
        },
        courseId: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      }, {
        timestamps: false
    })

    return UserCourse;
}