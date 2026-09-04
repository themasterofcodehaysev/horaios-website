<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'admin@horaiosbaptist.org')->first();
        $category = BlogCategory::first();

        $posts = [
            [
                'title' => 'Welcome to Horaios Baptist Church',
                'excerpt' => 'Discover our community of faith in Phnom Penh, Cambodia. Join us for worship, fellowship, and spiritual growth.',
                'content' => '<p>We are thrilled to welcome you to Horaios Baptist Church, a vibrant community of believers located in the heart of Phnom Penh, Cambodia. Our church is dedicated to spreading the love of God through worship, service, and genuine community.</p>
                <p>At Horaios, we believe in the power of authentic relationships and transformational teaching. Whether you are new to faith or have been walking with God for years, there is a place for you here.</p>
                <h3>Our Vision</h3>
                <p>To be a light in our city, bringing hope and healing through the message of Jesus Christ.</p>
                <h3>Our Mission</h3>
                <p>To equip believers to serve God and love their neighbors in practical ways.</p>',
                'featured_image' => '/images/blog/welcome-church.jpg',
                'category_id' => $category?->id,
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(7),
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'title' => 'Understanding Grace: A Journey Through Ephesians',
                'excerpt' => 'Join us as we dive deep into the book of Ephesians and discover the transformative power of God\'s grace in our lives.',
                'content' => '<p>This Sunday, we begin an exciting new sermon series on the book of Ephesians. Paul\'s letter to the Ephesians is rich with theological depth and practical wisdom for daily living.</p>
                <h3>What You Will Learn</h3>
                <ul>
                <li>The mystery of God\'s plan for redemption</li>
                <li>How grace transforms our identity</li>
                <li>Living out our faith in community</li>
                <li>The armor of God for spiritual warfare</li>
                </ul>
                <p>Don\'t miss this opportunity to grow in your understanding of Scripture and its application to your life.</p>',
                'featured_image' => '/images/blog/grace-series.jpg',
                'category_id' => $category?->id,
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(3),
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'title' => 'Community Outreach: Serving Our City',
                'excerpt' => 'Learn about our outreach programs and how you can get involved in serving the Phnom Penh community.',
                'content' => '<p>At Horaios Baptist Church, we believe that faith without works is dead. Our community outreach programs are designed to meet practical needs while sharing the love of Christ.</p>
                <h3>Current Outreach Programs</h3>
                <ul>
                <li><strong>Food Distribution:</strong> Weekly food packages for families in need</li>
                <li><strong>Youth Mentorship:</strong> After-school programs for local children</li>
                <li><strong>English Classes:</strong> Free English language instruction</li>
                <li><strong>Health Screenings:</strong> Monthly health check-ups</li>
                </ul>
                <h3>How to Get Involved</h3>
                <p>Contact our outreach coordinator to learn about volunteer opportunities and donation needs.</p>',
                'featured_image' => '/images/blog/outreach.jpg',
                'category_id' => $category?->id,
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDay(),
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'title' => 'Prayer and Fasting: A 40-Day Journey',
                'excerpt' => 'Join our church in a season of prayer and fasting as we seek God\'s direction for the coming year.',
                'content' => '<p>We are entering a special season of prayer and fasting as a church community. This 40-day journey is an opportunity to draw closer to God, seek His face, and intercede for our families, church, and city.</p>
                <h3>What is Fasting?</h3>
                <p>Fasting is the voluntary abstaining from food for spiritual purposes. It\'s not about earning God\'s favor, but about creating space to hear His voice more clearly.</p>
                <h3>Fasting Guidelines</h3>
                <ul>
                <li>Choose a fasting type that suits your health (water, Daniel fast, partial fast)</li>
                <li>Set aside specific times for prayer and Scripture reading</li>
                <li>Join our weekly prayer meetings</li>
                <li>Journal your experiences and what God is teaching you</li>
                </ul>',
                'featured_image' => '/images/blog/prayer-fasting.jpg',
                'category_id' => $category?->id,
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(14),
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
            [
                'title' => 'Youth Ministry Summer Camp Registration Open',
                'excerpt' => 'Sign up now for our annual youth summer camp! An unforgettable week of worship, fun, and spiritual growth.',
                'content' => '<p>Our annual youth summer camp is just around the corner! This year\'s theme is "Rooted in Faith" and promises to be an incredible week of spiritual growth, friendship, and fun.</p>
                <h3>Camp Details</h3>
                <ul>
                <li><strong>Date:</strong> July 15-20, 2026</li>
                <li><strong>Location:</strong> Kirirom National Park</li>
                <li><strong>Age:</strong> 13-18 years old</li>
                <li><strong>Cost:</strong> $150 per student (scholarships available)</li>
                </ul>
                <h3>What to Expect</h3>
                <ul>
                <li>Daily worship and biblical teaching</li>
                <li>Outdoor activities and team building</li>
                <li>Small group discussions</li>
                <li>Lifelong friendships</li>
                </ul>
                <p>Registration closes June 30. Contact our youth ministry team for more information.</p>',
                'featured_image' => '/images/blog/youth-camp.jpg',
                'category_id' => $category?->id,
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(21),
                'created_by' => $user?->id,
                'updated_by' => $user?->id,
            ],
        ];

        foreach ($posts as $post) {
            BlogPost::updateOrCreate(
                ['title' => $post['title']],
                $post
            );
        }

        $this->command->info('Blog posts seeded successfully.');
    }
}
