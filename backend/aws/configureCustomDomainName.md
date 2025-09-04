Yep — you can do everything in the AWS Console, and keep DNS in Namecheap. Here’s the clean, manual path for www.invoiceglide.com:

A) Get an SSL cert (ACM, us-east-1 only)

In AWS Console → Certificate Manager (region N. Virginia / us-east-1).

Request a public certificate → add www.invoiceglide.com
(optional: also add invoiceglide.com so you’re future-proof).

Choose DNS validation → continue → you’ll see a CNAME record to add.

B) Add the validation CNAME in Namecheap

Namecheap → Domain List → Manage → Advanced DNS.

Add CNAME:

Host: copy the left side from ACM’s “Name” (e.g. _abc123.www) without the trailing dot.

Value: the full “Value” from ACM (e.g. _xyz.acm-validations.aws) without the trailing dot.

TTL: Automatic.

Back in ACM, watch the certificate go to Issued.

C) Tell CloudFront to serve your domain

AWS Console → CloudFront → Distributions → open your distribution.

Settings / General → Edit:

Alternate domain names (CNAMEs): add www.invoiceglide.com.

Custom SSL certificate: pick the Issued ACM cert (must be in us-east-1).

Save. (CloudFront will deploy the change.)

D) Point your domain at CloudFront

Namecheap → Advanced DNS → add another CNAME:

Host: www

Value: your CF domain (e.g. d1irn33k13xku4.cloudfront.net)

TTL: Automatic.

Optional: make the apex (invoiceglide.com) redirect to www.
In Namecheap, add URL Redirect (Permanent, 301):
@ → https://www.invoiceglide.com/

E) Verify & (optionally) refresh

Visit https://www.invoiceglide.com
(must show your app, valid padlock).

In CloudFront → Distributions → your distro → Invalidations → create one for /index.html if you need an instant UI flip after a deploy.

Common gotchas

ACM not in us-east-1 → SSL won’t attach to CloudFront.

Wrong DNS record → leave off trailing dots in Namecheap’s Host/Value fields.

“CNAME already in use” in CloudFront → the domain is (or was) on another distribution; remove it there first.

Blank page / HTML on API call → ensure frontend calls use /api/... so CloudFront routes to EC2.

If you want, I can also give you a tiny update to your CloudFormation file so future domain changes (Aliases + cert) are one-click via stack updates, but the console steps above are totally fine.