# 🚀 BrightBuddy Deployment Guide - Vercel + Custom Domain

## Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account (free tier available)
- Domain name (optional, but recommended)
- OpenAI API key (for AI features)

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: BrightBuddy Learning & Wellness Journal"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/brightbuddy.git
git branch -M main
git push -u origin main
```

### 1.2 Environment Variables
Create a `.env.local` file in your project root:
```bash
# OpenAI API Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

**Important**: Never commit your actual API key to Git!

## Step 2: Deploy to Vercel

### 2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect it's a Next.js project

### 2.2 Configure Project Settings
- **Project Name**: `brightbuddy` (or your preferred name)
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 2.3 Environment Variables in Vercel
1. In the Vercel dashboard, go to your project
2. Navigate to **Settings** → **Environment Variables**
3. Add your OpenAI API key:
   - **Name**: `NEXT_PUBLIC_OPENAI_API_KEY`
   - **Value**: Your actual OpenAI API key
   - **Environment**: Production, Preview, Development
4. Click "Save"

### 2.4 Deploy
1. Click "Deploy"
2. Vercel will build and deploy your app
3. You'll get a URL like: `https://brightbuddy-xyz.vercel.app`

## Step 3: Connect Custom Domain

### 3.1 Add Domain in Vercel
1. Go to your project dashboard
2. Navigate to **Settings** → **Domains**
3. Click "Add Domain"
4. Enter your domain (e.g., `brightbuddy.com` or `app.yourdomain.com`)
5. Click "Add"

### 3.2 Configure DNS Records

#### Option A: Using Vercel's Nameservers (Recommended)
1. In Vercel, you'll see nameservers like:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ns5.vercel-dns.com
   ```

2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Find DNS settings for your domain
4. Change nameservers to Vercel's nameservers
5. Wait 24-48 hours for propagation

#### Option B: Using A Records (Alternative)
If you prefer to keep your current nameservers:
1. Add an A record:
   - **Name**: `@` (or your subdomain)
   - **Value**: `76.76.19.19`
   - **TTL**: `3600`

2. Add a CNAME record:
   - **Name**: `www`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: `3600`

### 3.3 Verify Domain
1. Back in Vercel, wait for domain verification
2. Status should change to "Valid Configuration"
3. Your app will be accessible at your custom domain

## Step 4: Configure SSL/HTTPS

Vercel automatically provides SSL certificates for all domains. No additional configuration needed!

## Step 5: Set Up Automatic Deployments

### 5.1 GitHub Integration
- Every push to `main` branch triggers automatic deployment
- Pull requests create preview deployments
- Deployments are instant and zero-downtime

### 5.2 Environment-Specific Variables
You can set different environment variables for:
- **Production**: Live site
- **Preview**: Pull request deployments
- **Development**: Local development

## Step 6: Post-Deployment Configuration

### 6.1 Test Your App
1. Visit your deployed URL
2. Test all features:
   - Journal entries
   - Progress tracking
   - AI features (if configured)
   - Wellness tools

### 6.2 Configure AI Features
1. Go to your app → Profile → AI Settings
2. Enter your OpenAI API key
3. Test AI features

### 6.3 Performance Monitoring
Vercel provides:
- **Analytics**: Page views, performance metrics
- **Functions**: Serverless function monitoring
- **Edge Network**: Global CDN performance

## Step 7: Customization (Optional)

### 7.1 Custom Branding
Update these files for your branding:
- `src/app/layout.tsx` - App title and metadata
- `public/` folder - Favicon and images
- `src/components/` - UI components

### 7.2 SEO Optimization
Update metadata in `src/app/layout.tsx`:
```typescript
export const metadata = {
  title: 'Your App Name',
  description: 'Your app description',
  keywords: 'learning, wellness, journal',
  openGraph: {
    title: 'Your App Name',
    description: 'Your app description',
  },
}
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation

#### 2. Environment Variables
- Ensure variables are set in Vercel dashboard
- Check variable names match exactly
- Redeploy after adding variables

#### 3. Domain Issues
- DNS propagation can take 24-48 hours
- Verify DNS records are correct
- Check domain registrar settings

#### 4. AI Features Not Working
- Verify OpenAI API key is set
- Check API key has sufficient credits
- Test API key in OpenAI dashboard

### Performance Optimization

#### 1. Image Optimization
- Use Next.js `Image` component
- Optimize image sizes
- Use WebP format when possible

#### 2. Bundle Size
- Monitor bundle size in Vercel analytics
- Use dynamic imports for large components
- Optimize third-party dependencies

#### 3. Caching
- Vercel automatically caches static assets
- Use appropriate cache headers
- Implement ISR for dynamic content

## Security Considerations

### 1. API Keys
- Never expose API keys in client-side code
- Use environment variables
- Rotate keys regularly

### 2. Data Privacy
- Implement proper data handling
- Use HTTPS (automatic with Vercel)
- Consider GDPR compliance

### 3. Rate Limiting
- Implement rate limiting for AI features
- Monitor API usage
- Set up alerts for unusual activity

## Cost Management

### Vercel Pricing
- **Hobby**: Free tier (perfect for personal projects)
- **Pro**: $20/month (for teams and businesses)
- **Enterprise**: Custom pricing

### OpenAI Costs
- **GPT-4o-mini**: ~$0.15 per 1M tokens
- **Typical usage**: $1-5/month for regular use
- **Free tier**: $5 credit for new users

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

## Next Steps

1. **Monitor Performance**: Use Vercel analytics
2. **Set Up Monitoring**: Configure alerts
3. **Backup Strategy**: Regular data backups
4. **Scaling**: Plan for growth
5. **Updates**: Keep dependencies updated

---

**Congratulations!** Your BrightBuddy app is now live and accessible worldwide! 🎉

For additional help, check the [AI Integration README](AI_INTEGRATION_README.md) for detailed AI feature setup. 