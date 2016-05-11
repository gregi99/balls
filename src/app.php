<?php

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();

$app['debug'] = true;

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));

$app->get('/', function () use ($app) {
    return $app['twig']->render('template.twig', []);
});

$app->post('/get-balls', function (Silex\Application $app, Symfony\Component\HttpFoundation\Request $request) {
    /** int[] **/
    $userNumbers = $request->get('numbers', null);

    if ($userNumbers === null || false === is_array($userNumbers) || count($userNumbers) === 0) {
        throw new InvalidArgumentException('no numbers, why ?');
    }

    $basketCount = 30;
    $baskets     = [];

    for ($i=0; $i < $basketCount; $i++) {
        $ballsInBasket = random_int(1, 10);
        $balls         = [];

        for ($k = 0; $k < $ballsInBasket; $k++) {
            $balls[] = random_int(1, 7);
        }

        $intersection      = array_intersect($userNumbers, $balls);
        $intersectionCount = count($intersection);

        $baskets[] = [
            'balls'        => $balls,
            'onlyOneBall'  => $intersectionCount === 1,
            'allUserBalls' => $intersectionCount === $ballsInBasket,
        ];
    }

    return new Symfony\Component\HttpFoundation\Response(json_encode($baskets), 200);
});