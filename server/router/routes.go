package router

import (
	"net/http"
	"table-booking/config"
	"table-booking/controllers"
	"table-booking/helpers"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
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
		isAdmin := helpers.IsAdmin(c.GetHeader("user_id"), c.GetHeader("org_id"))
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
	router := gin.Default()
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

		//table related routes
		table := new(controllers.TableController)
		v1.POST("/table", AuthMiddleware(), table.AddOrEdit)
		v1.GET("/table/org", AuthMiddleware(), isAdminMiddleware(), table.GetTablesOfOrg)
		// v1.POST("/table/branch", AuthMiddleware(), table.GetTablesOfBranch)
		v1.GET("/tables", AuthMiddleware(), table.GetTables)
		v1.GET("/table", AuthMiddleware(), table.GetTable)
		v1.PUT("/table", AuthMiddleware(), user.Update)

		//branch related routes
		branch := new(controllers.BranchController)
		v1.POST("/branch", AuthMiddleware(), branch.Add)
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
		v1.POST("/kitchen", AuthMiddleware(), kitchen.Add)
		// v1.POST("/table/branch", AuthMiddleware(), table.GetTablesOfBranch)
		v1.GET("/kitchens", AuthMiddleware(), kitchen.GetKitchens)
	}

	//for react
	router.NoRoute(func(c *gin.Context) {
		c.File("../ui/build/index.html")
	})
	router.Any("/events", AuthMiddleware(), func(c *gin.Context) {
		hub := helpers.GetHub()
		go hub.Run()

		var upgrader = websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin:     func(r *http.Request) bool { return true },
		}

		connection, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			panic(err)
		}
		helpers.CreateNewSocketUser(hub, connection, c.GetHeader("user_name"), c.GetHeader("user_id"))
	})
	router.Run(":" + config.GetConfig().Port)

}
