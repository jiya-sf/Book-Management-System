'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize){
        return queryInterface.sequelize.transaction(async(transaction)=>{
      await queryInterface.createTable('Authors',{
      id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
      },
      name:{
        type:Sequelize.STRING(100),
        allowNull:false
      },
      createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
  },
    },{transaction});
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('Authors');
  });
}
};