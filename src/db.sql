DROP TABLE IF EXISTS "Users";
CREATE TABLE "Users" (
  "id" int4 NOT NULL,
  "fullname" varchar(255) NOT NULL,
  "username" varchar(255) NOT NULL,
  "phone" varchar(10) NOT NULL,
  "email" varchar(255) NOT NULL,
  "address" varchar(255) NOT NULL,
  "password" varchar(255) NOT NULL  
);

DROP TABLE IF EXISTS "FavoriteRecipes";
CREATE TABLE "FavoriteRecipes" (
  "id" int4 NOT NULL,
  "userID" int4 NOT NULL,
  "recipeName" varchar(255) NOT NULL
);

ALTER TABLE "Users" ADD CONSTRAINT "PK_Users" PRIMARY KEY ("id");
ALTER TABLE "FavoriteRecipes" ADD CONSTRAINT "PK_FavoriteRecipes" PRIMARY KEY ("id");

ALTER TABLE "FavoriteRecipes" ADD CONSTRAINT "FK_FavoriteRecipes_Users" FOREIGN KEY ("userID") REFERENCES "Users" ("id");