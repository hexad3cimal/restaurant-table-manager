package router

import (
	"fmt"
	"net/http"
	"table-booking/config"
	"table-booking/controllers"
	"table-booking/helpers"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
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
		isAdmin := helpers.IsAdmin(c.GetHeader("role_id"), c.GetHeader("org_id"))
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

		//table related routes
		table := new(controllers.TableController)
		v1.POST("/table", AuthMiddleware(), table.Add)
		v1.GET("/table/org", AuthMiddleware(), isAdminMiddleware(), table.GetTablesOfOrg)
		// v1.POST("/table/branch", AuthMiddleware(), table.GetTablesOfBranch)
		v1.GET("/tables", AuthMiddleware(), table.GetTables)

		//branch related routes
		branch := new(controllers.BranchController)
		v1.POST("/branch", AuthMiddleware(), branch.Add)
		v1.GET("/branches", AuthMiddleware(), branch.GetBranches)
		v1.GET("/branch/org", AuthMiddleware(), isAdminMiddleware(), branch.GetBranchesOfOrg)

		product := new(controllers.ProductController)
		v1.POST("/product", AuthMiddleware(), product.Add)
		v1.GET("/products", AuthMiddleware(), product.GetProducts)
		v1.GET("/product/org", AuthMiddleware(), isAdminMiddleware(), branch.GetBranchesOfOrg)

		order := new(controllers.OrderController)
		v1.POST("/order", AuthMiddleware(), order.Add)
		v1.GET("/order", AuthMiddleware(), order.GetOrdersOfTable)
		// v1.GET("/product/org", AuthMiddleware(), isAdminMiddleware(), branch.GetBranchesOfOrg)
	}

	//for react
	router.NoRoute(func(c *gin.Context) {
		c.File("../ui/build/index.html")
	})
	server, _ := socketio.NewServer(nil)
	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("connected:", s.ID())
		s.Emit("reply", "have "+s.ID())
		return nil
	})

	go server.Serve()
	defer server.Close()
	router.GET("/events/*any", gin.WrapH(server))
	router.POST("/events/*any", gin.WrapH(server))
	router.Run(":" + config.GetConfig().Port)

}
