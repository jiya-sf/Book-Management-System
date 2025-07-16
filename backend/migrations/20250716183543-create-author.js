'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize){
        return queryInterface.sequelize.transaction(async(transaction)=>{
      await queryInterface.createTable('Authors',{
      id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true
      },
      name:{
        type:Sequelize.STRING(100),
        allowNull:false
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