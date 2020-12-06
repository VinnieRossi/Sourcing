using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Stripe;
using Stripe.Checkout;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SourcingApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class PaymentsController : ControllerBase
    {

        public PaymentsController(IConfiguration configuration)
        {
            StripeConfiguration.ApiKey = configuration["StripeSK"];
        }

        [HttpPost("create-checkout-session")]
        public ActionResult CreateCheckoutSession()
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string>
                {
                    "card"
                },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = 100,
                            Currency = "usd",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = "T-shirt"
                            },
                        },
                        Quantity = 1,
                    }
                },
                Mode = "payment",
                SuccessUrl = "https://www.betterfrosting.com/about",
                CancelUrl = "https://www.betterfrosting.com/"
            };

            var service = new SessionService();
            Session session = service.Create(options);

            return new JsonResult(new { id = session.Id });
        }

    }

}