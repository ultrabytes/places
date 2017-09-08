module.exports = function(res){

    return {
      success:function(data,message){

          return res.json({

              success:true,
              message: message ? message : "Operation successful",
              data:data || []

          });

      },
        error:function(err,message){

            return res.json({

                success:false,
                message: message ? message : "Operation failed.",
                err:err

            });

        }

    };

};