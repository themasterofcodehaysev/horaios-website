<?php

namespace Database\Seeders;

use App\Models\Sermon;
use App\Models\SermonCategory;
use App\Models\SermonSeries;
use App\Models\Speaker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SermonSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Speakers
        $speakersData = [
            [
                'name' => 'Pastor John Smith',
                'position' => 'Senior Pastor',
                'biography' => 'Senior Pastor at Horaios Baptist Church with over 20 years of ministry leadership in Southeast Asia.',
                'email' => 'john.smith@horaios.org',
                'status' => 'active',
                'display_order' => 1,
            ],
            [
                'name' => 'Pastor David Lee',
                'position' => 'Associate Pastor',
                'biography' => 'Focuses on discipleship, biblical teaching, and community outreach in Phnom Penh.',
                'email' => 'david.lee@horaios.org',
                'status' => 'active',
                'display_order' => 2,
            ],
            [
                'name' => 'Pastor Sarah Johnson',
                'position' => 'Youth Pastor',
                'biography' => 'Leads the youth and young adults ministry, passionate about gospel transformation in the next generation.',
                'email' => 'sarah.j@horaios.org',
                'status' => 'active',
                'display_order' => 3,
            ],
            [
                'name' => 'Dr. James White',
                'position' => 'Guest Evangelist',
                'biography' => 'Visiting theologian and itinerant preacher specializing in New Testament exposition.',
                'status' => 'active',
                'display_order' => 4,
            ],
        ];

        $speakers = [];
        foreach ($speakersData as $sp) {
            $sp['uuid'] = (string) Str::uuid();
            $speakers[] = Speaker::create($sp);
        }

        // 2. Seed Sermon Series
        $seriesData = [
            ['name' => 'Romans: The Power of the Gospel', 'description' => 'A verse-by-verse journey through Paul’s epistle to the Romans.', 'display_order' => 1],
            ['name' => 'Faith Foundations', 'description' => 'Core Christian doctrines and spiritual habits for daily Christian living.', 'display_order' => 2],
            ['name' => 'Christmas 2024: The Light Has Come', 'description' => 'Celebrating the incarnation and hope of Jesus Christ.', 'display_order' => 3],
            ['name' => 'Easter: Risen & Reigning', 'description' => 'Reflecting on the victory of the resurrection.', 'display_order' => 4],
            ['name' => 'Family Life & Godly Marriage', 'description' => 'Biblical principles for healthy Christian homes and relationships.', 'display_order' => 5],
            ['name' => 'Prayer & Fasting', 'description' => 'Seeking God’s face with boldness and spiritual endurance.', 'display_order' => 6],
        ];

        $seriesList = [];
        foreach ($seriesData as $se) {
            $se['uuid'] = (string) Str::uuid();
            $se['status'] = 'active';
            $seriesList[] = SermonSeries::create($se);
        }

        // 3. Seed Sermon Categories
        $categoriesData = [
            ['name' => 'Sunday Worship Service', 'description' => 'Main Sunday morning worship messages', 'display_order' => 1],
            ['name' => 'Midweek Bible Study', 'description' => 'Deep dive scripture studies on Wednesday evenings', 'display_order' => 2],
            ['name' => 'Youth Service', 'description' => 'Messages geared towards teenagers and university students', 'display_order' => 3],
            ['name' => 'Special Event', 'description' => 'Conferences, ordination services, and special occasions', 'display_order' => 4],
            ['name' => 'Guest Speaker', 'description' => 'Sermons delivered by visiting pastors and evangelists', 'display_order' => 5],
        ];

        $categories = [];
        foreach ($categoriesData as $ca) {
            $ca['uuid'] = (string) Str::uuid();
            $ca['status'] = 'active';
            $categories[] = SermonCategory::create($ca);
        }

        // 4. Seed Sermons
        $sermonsData = [
            [
                'title' => 'Unashamed of the Gospel',
                'summary' => 'For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes.',
                'description' => "## Overview\nIn this message, Pastor John Smith explores Romans 1:16-17 and what it means to live unashamed in a modern secular world.\n\n### Key Takeaways\n- The Gospel is not advice; it is **God's power**.\n- Righteousness is received by faith alone.\n- Boldness in witnessing stems from understanding grace.\n\n> *\"For in the gospel the righteousness of God is revealed—a righteousness that is by faith from first to last.\"*",
                'scripture_reference' => 'Romans 1:16-17',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'speaker_id' => $speakers[0]->id,
                'series_id' => $seriesList[0]->id,
                'category_id' => $categories[0]->id,
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(14),
            ],
            [
                'title' => 'No Condemnation in Christ',
                'summary' => 'There is therefore now no condemnation for those who are in Christ Jesus.',
                'description' => "## Romans 8 Exposition\nPaul delivers one of the most powerful assurances in all of Holy Scripture.\n\n### Points Covered\n1. **Freedom from Law and Sin**\n2. **Walking according to the Spirit**\n3. **Joint-heirs with Christ**",
                'scripture_reference' => 'Romans 8:1-4',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'speaker_id' => $speakers[0]->id,
                'series_id' => $seriesList[0]->id,
                'category_id' => $categories[0]->id,
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(7),
            ],
            [
                'title' => 'Walking by Faith, Not by Sight',
                'summary' => 'Discover how true biblical faith empowers believers to trust God even during seasons of deep uncertainty.',
                'description' => "## Message Notes\nWhen circumstances look grim, faith anchors our soul to the unbreakable promises of God.\n\n- Faith sees beyond immediate trials.\n- Abraham's journey of obedience.",
                'scripture_reference' => '2 Corinthians 5:7',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'speaker_id' => $speakers[1]->id,
                'series_id' => $seriesList[1]->id,
                'category_id' => $categories[1]->id,
                'featured' => true,
                'status' => 'published',
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'The Word Became Flesh',
                'summary' => 'Reflecting on the mystery and majesty of the Incarnation of Jesus Christ.',
                'description' => "## Christmas Celebration Sermon\nThe light shines in the darkness, and the darkness has not overcome it.",
                'scripture_reference' => 'John 1:14',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'speaker_id' => $speakers[0]->id,
                'series_id' => $seriesList[2]->id,
                'category_id' => $categories[3]->id,
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(45),
            ],
            [
                'title' => 'Radical Discipleship for Youth',
                'summary' => 'Challenging young adults to deny self, take up their cross, and follow Christ daily.',
                'description' => "## Youth Service Message\nDon't let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.",
                'scripture_reference' => '1 Timothy 4:12',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'speaker_id' => $speakers[2]->id,
                'series_id' => $seriesList[1]->id,
                'category_id' => $categories[2]->id,
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'Building a Family on the Rock',
                'summary' => 'Practical and spiritual biblical guidance for parenting, marriage, and family harmony.',
                'description' => "## Family Life Series\nUnless the LORD builds the house, the builders labor in vain.",
                'scripture_reference' => 'Psalm 127:1',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'speaker_id' => $speakers[1]->id,
                'series_id' => $seriesList[4]->id,
                'category_id' => $categories[0]->id,
                'featured' => false,
                'status' => 'published',
                'published_at' => now()->subDays(20),
            ],
            [
                'title' => 'The Power of Persistent Prayer (Draft)',
                'summary' => 'Draft sermon on Luke 18 parables.',
                'description' => "Draft text for upcoming prayer series.",
                'scripture_reference' => 'Luke 18:1-8',
                'speaker_id' => $speakers[0]->id,
                'series_id' => $seriesList[5]->id,
                'category_id' => $categories[1]->id,
                'featured' => false,
                'status' => 'draft',
            ],
            [
                'title' => 'The Supremacy of Christ (Draft)',
                'summary' => 'Guest sermon draft on Colossians 1.',
                'description' => "Draft notes by Dr. James White.",
                'scripture_reference' => 'Colossians 1:15-20',
                'speaker_id' => $speakers[3]->id,
                'series_id' => null,
                'category_id' => $categories[4]->id,
                'featured' => false,
                'status' => 'draft',
            ],
        ];

        foreach ($sermonsData as $se) {
            $se['uuid'] = (string) Str::uuid();
            Sermon::create($se);
        }
    }
}
