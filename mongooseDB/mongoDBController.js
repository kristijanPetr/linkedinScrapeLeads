var companiesModel = require("./mongoDBModel");
const countryMapper = require("../companyData/countriesMap.json");

/**
 * companiesController.js
 *
 * @description :: Server-side logic for managing companiess.
 */
module.exports = {
  /**
   * companiesController.list()
   */
  list: function(req, res) {
    companiesModel.find(function(err, companiess) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting companies.",
          error: err
        });
      }
      return res.json(companiess);
    });
  },

  /**
   * companiesController.show()
   */
  show: function(req, res) {
    var id = req.params.id;

    companiesModel.findOne({ _id: id }, function(err, companies) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting companies.",
          error: err
        });
      }
      if (!companies) {
        return res.status(404).json({
          message: "No such companies"
        });
      }
      return res.json(companies);
    });
  },

  /**
   * companiesController.create()
   */
  create: function(req, res) {
    var companies = new companiesModel({
      companyName: req.body.companyName,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      country: req.body.country,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      website: req.body.website,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    });
    companies.save(function(err, companies) {
      if (err) {
        return console.log({
          message: "Error when creating companies",
          error: err
        });
      }
      return console.log("added"); //res.status(201).json(companies);
    });
  },

  /**
   * companiesController.update()
   */
  update: function(req, res) {
    var id = req.params.id;
    companiesModel.findOne({ _id: id }, function(err, companies) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting companies",
          error: err
        });
      }
      if (!companies) {
        return res.status(404).json({
          message: "No such companies"
        });
      }

      companies.companyName = req.body.companyName
        ? req.body.companyName
        : companies.companyName;
      companies.description = req.body.description
        ? req.body.description
        : companies.description;
      companies.address = req.body.address
        ? req.body.address
        : companies.address;
      companies.city = req.body.city ? req.body.city : companies.city;
      companies.state = req.body.state ? req.body.state : companies.state;
      companies.zip = req.body.zip ? req.body.zip : companies.zip;
      companies.country = req.body.country
        ? req.body.country
        : companies.country;
      companies.latitude = req.body.latitude
        ? req.body.latitude
        : companies.latitude;
      companies.longitude = req.body.longitude
        ? req.body.longitude
        : companies.longitude;
      companies.website = req.body.website
        ? req.body.website
        : companies.website;
      companies.firstName = req.body.firstName
        ? req.body.firstName
        : companies.firstName;
      companies.lastName = req.body.lastName
        ? req.body.lastName
        : companies.lastName;
      companies.email = req.body.email ? req.body.email : companies.email;

      companies.save(function(err, companies) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating companies.",
            error: err
          });
        }

        return res.json(companies);
      });
    });
  },

  /**
   * companiesController.remove()
   */
  remove: function(req, res) {
    var id = req.params.id;
    companiesModel.findByIdAndRemove(id, function(err, companies) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the companies.",
          error: err
        });
      }
      return res.status(204).json();
    });
  },
  // findByCompanyName: companyName => {
  //   companyName = companyName.toLowerCase();
  //   return companiesModel
  //     .findOne({ companyName })
  //     .then(company => {
  //       return company;
  //     })
  //     .catch(err => []);
  // },
  findByUserName: (firstName, lastName, state) => {
    firstName = firstName.toLowerCase();
    lastName = lastName.toLowerCase();
    // state = countryMapper[state];
    // console.log("State", state);
    return companiesModel
      .findOne({ firstName }, { lastName }, { state })
      .then(company => {
        return company;
      })
      .catch(err => {});
  },
  updateOrInsertCompany: (
    firstName,
    lastName,
    address,
    website,
    city,
    state,
    shortCode,
    companyName,
    email
  ) => {
    companyName = companyName.toLowerCase().trim();
    companiesModel.update(
      { companyName },
      {
        website,
        email,
        address,
        companyName,
        firstName,
        lastName,
        state,
        city,
        state: shortCode
      },
      { upsert: true, setDefaultsOnInsert: true },
      (err, raw) => {
        console.log("err", err, "raw ", raw, "company name", companyName);
        if (err) {
        }
      }
    );
  },
  findByCompanyName: companyName => {
    companyName = companyName.toLowerCase().trim();
    return companiesModel
      .findOne({ companyName })
      .then(result => {
        console.log("Company Found", result);
        return result;
      })
      .catch(err => console.log("Find company err", err));
  },
  findByUserAndCompany: (firstName, lastName, companyName) => {
    if (
      firstName != undefined &&
      lastName != undefined &&
      companyName != undefined
    ) {
      firstName = firstName.toLowerCase();
      lastName = lastName.toLowerCase();
      companyName = companyName.toLowerCase();
      return companiesModel
        .find({ firstName, lastName, companyName })
        .then(company => {
          return company;
        })
        .catch(err => {});
    } else {
      console.log("NO PARAMETARS");
    }
  },
  findByFirstLastName: (firstname, lastname) => {
    if (firstname != undefined && firstname != undefined) {
      return companiesModel
        .find({ firstname, lastname })
        .then(company => {
          return company;
        })
        .catch(err => {});
    } else {
      console.log("NO PARAMETARS");
    }
  },

  findSimilar: searchQuery => {
    searchQuery = searchQuery
      .toLowerCase()
      .replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
      .replace("\\", "");
    let newReg = searchQuery.split("-").map(item => item.trim());
    console.log(newReg);

    return companiesModel
      .find({
        companyName: {
          $in: newReg
        }
      })
      .then(company => {
        return company;
      })
      .catch(err => []);
  },
  getRandomUser: () => {
    companiesModel.count().exec(function(err, count) {
      // Get a random entry
      var random = Math.floor(Math.random() * count);

      // Again query all users but only fetch one offset by our random #
      companiesModel
        .findOne()
        .skip(random)
        .exec(function(err, result) {
          // Tada! random user
          console.log(result);
        });
    });
  }
};
