package router

import (
	"net/http"
	"table-booking/config"
	"table-booking/controllers"
	"table-booking/helpers"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
)

func generateContextId() gin.HandlerFunc {
	return func(c *gin.Context) {
		contextId := uuid.NewV4()
		c.Writer.Header().Set("X-Context-Id", contextId.String())
		c.Next()
	}
}

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding, x-access-token")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
		}
		c.Next()
	}
}

var auth = new(controllers.AuthController)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		auth.IstokenValid(c)
		c.Next()
	}
}

func isAdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		isAdmin := helpers.IsAdmin(c.GetHeader("access_uuid"))
		if isAdmin == true {
			c.Next()
			return
		}
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid authorization"})
		c.Abort()
		return
	}
}

func InitRouter() {

	router := gin.New()
	router.Use(CORS())
	router.Use(generateContextId())
	router.Use(gzip.Gzip(gzip.DefaultCompression))

	router.Use(static.Serve("/", static.LocalFile("../ui/build", true)))

	v1 := router.Group("/v1/api")
	{
		//user related routes
		user := new(controllers.UserController)
		v1.POST("/user/login", user.Login)
		v1.POST("/user/register", user.Register)
		v1.GET("/token/refresh", auth.Refresh)
		v1.GET("/token/_", auth.IstokenValid)
		v1.GET("/user/validate", user.Validate)
		v1.GET("/user/auth/validate", AuthMiddleware(), user.Validate)
		v1.GET("/user/logout", AuthMiddleware(), user.Logout)

		//table related routes
		table := new(controllers.TableController)
		v1.POST("/table", AuthMiddleware(), isAdminMiddleware(), table.AddOrEdit)
		v1.GET("/tables", AuthMiddleware(), table.GetTables)
		v1.GET("/table", AuthMiddleware(), table.GetTable)
		v1.PUT("/table", AuthMiddleware(), isAdminMiddleware(), user.Update)
		v1.DELETE("/table", AuthMiddleware(), isAdminMiddleware(), table.Delete)

		//branch related routes
		branch := new(controllers.BranchController)
		v1.POST("/branch", AuthMiddleware(), isAdminMiddleware(), branch.AddOrEdit)
		v1.DELETE("/branch", AuthMiddleware(), isAdminMiddleware(), branch.Delete)
		v1.GET("/branches", AuthMiddleware(), branch.GetBranches)
		v1.GET("/branch/org", AuthMiddleware(), isAdminMiddleware(), branch.GetBranchesOfOrg)

		product := new(controllers.ProductController)
		v1.POST("/product", AuthMiddleware(), product.Add)
		v1.GET("/products", AuthMiddleware(), product.GetProducts)
		v1.GET("/product/org", AuthMiddleware(), isAdminMiddleware(), branch.GetBranchesOfOrg)
		v1.GET("/product/top", AuthMiddleware(), product.GetTopProducts)

		order := new(controllers.OrderController)
		v1.POST("/order", AuthMiddleware(), order.Add)
		v1.GET("/order", AuthMiddleware(), order.GetOrdersOfTable)
		v1.GET("/orders", AuthMiddleware(), order.GetOrders)

		kitchen := new(controllers.KitchenController)
		v1.POST("/kitchen", AuthMiddleware(), isAdminMiddleware(), kitchen.AddOrEdit)
		v1.DELETE("/kitchen", AuthMiddleware(), isAdminMiddleware(), kitchen.Delete)
		v1.GET("/kitchens", AuthMiddleware(), isAdminMiddleware(), kitchen.GetKitchens)
	}

	//for react
	router.NoRoute(func(c *gin.Context) {
		c.File("../ui/build/index.html")
	})
	socket := new(controllers.SocketController)

	router.Any("/events", AuthMiddleware(), socket.Handle)
	router.Run(":" + config.GetConfig().Port)

}
