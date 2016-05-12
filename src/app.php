<?php

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/Resources/views',
));

$app->get('/', function () use ($app) {
    return $app['twig']->render('template.twig', []);
});

$app->post('/get-balls', function (Silex\Application $app, Symfony\Component\HttpFoundation\Request $request) {
    /** int[] **/
    $userRequest = json_decode($request->getContent(), true);

    if ($userRequest === null || false === is_array($userRequest) || !array_key_exists('numbers', $userRequest)) {
        throw new InvalidArgumentException('no numbers, why ?');
    }

    $userNumbers = $userRequest['numbers'];

    $basketCount = 30;
    $baskets     = [];

    for ($i=0; $i < $basketCount; $i++) {
        $ballsInBasket = random_int(1, 10);
        $balls         = [];

        for ($k = 0; $k < $ballsInBasket; $k++) {
            $balls[] = random_int(1, 999);
        }

        $intersection      = array_intersect($userNumbers, $balls);
        $intersectionCount = count($intersection);

        $baskets[] = [
            'balls'        => $balls,
            'onlyOneBall'  => $intersectionCount === 1,
            'allUserBalls' => $intersectionCount === $ballsInBasket,
        ];
    }

    return new Symfony\Component\HttpFoundation\JsonResponse(json_encode($baskets), 200);
});