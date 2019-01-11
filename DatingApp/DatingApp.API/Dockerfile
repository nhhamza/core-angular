FROM microsoft/dotnet:2.1-sdk AS build-env
WORKDIR /build
COPY . /build

#Restore
RUN dotnet restore ./DatingApp.API.csproj

RUN dotnet publish . -o /publish --configuration Release

EXPOSE 4200
# Build runtime image
FROM microsoft/dotnet:2.1-aspnetcore-runtime
WORKDIR /app
COPY --from=build-env /publish/ .
ENTRYPOINT ["dotnet", "DatingApp.API.dll"]